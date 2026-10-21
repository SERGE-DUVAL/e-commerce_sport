const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const sequelize = require('../config/database');
const { migrateLegacyColumns } = require('../config/schema');
require('../models');

const sourcePath = process.env.SOURCE_SQLITE_PATH ||
  path.join(__dirname, '..', '..', 'database', 'sport-equip.sqlite');
const quoteIdentifier = identifier => `"${identifier.replace(/"/g, '""')}"`;

function sqliteQuery(database, sql) {
  return new Promise((resolve, reject) => {
    database.all(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

async function getSourceTables(database) {
  const rows = await sqliteQuery(
    database,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  return rows.map(row => row.name);
}

async function assertSourceIntegrity(database) {
  const violations = await sqliteQuery(database, 'PRAGMA foreign_key_check');
  if (violations.length === 0) {
    return;
  }

  const counts = new Map();
  for (const violation of violations) {
    const key = `${violation.table} → ${violation.parent}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const summary = [...counts.entries()]
    .map(([relation, count]) => `${relation}: ${count}`)
    .join(', ');
  throw new Error(
    `La base SQLite contient ${violations.length} violation(s) de clé étrangère (${summary}). ` +
    'Corrigez la source avant toute migration.'
  );
}

async function getTargetForeignKeys(client) {
  const result = await client.query(
    `SELECT child.table_name AS child_table, parent.table_name AS parent_table
     FROM information_schema.table_constraints constraint_info
     JOIN information_schema.key_column_usage child
       ON child.constraint_name = constraint_info.constraint_name
       AND child.constraint_schema = constraint_info.constraint_schema
     JOIN information_schema.constraint_column_usage parent
       ON parent.constraint_name = constraint_info.constraint_name
       AND parent.constraint_schema = constraint_info.constraint_schema
     WHERE constraint_info.constraint_type = 'FOREIGN KEY'
       AND constraint_info.constraint_schema = current_schema()`
  );
  return result.rows;
}

async function orderTablesByForeignKeys(database, tables, targetForeignKeys) {
  const dependencies = new Map();

  for (const table of tables) {
    const foreignKeys = await sqliteQuery(database, `PRAGMA foreign_key_list(${quoteIdentifier(table)})`);
    const targetDependencies = targetForeignKeys
      .filter(key => key.child_table === table)
      .map(key => key.parent_table);
    dependencies.set(
      table,
      new Set(
        [...foreignKeys.map(key => key.table), ...targetDependencies]
          .filter(name => tables.includes(name))
      )
    );
  }

  const pending = new Set(tables);
  const ordered = [];

  while (pending.size > 0) {
    const ready = [...pending]
      .filter(table => [...dependencies.get(table)].every(dependency => !pending.has(dependency)))
      .sort();

    if (ready.length === 0) {
      throw new Error('La base SQLite contient un cycle de clés étrangères ; migration interrompue.');
    }

    for (const table of ready) {
      pending.delete(table);
      ordered.push(table);
    }
  }

  return ordered;
}

async function getTargetColumns(client, table) {
  const result = await client.query(
    'SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = $1',
    [table]
  );
  return new Set(result.rows.map(row => row.column_name));
}

async function assertTargetIsEmpty(client, tables) {
  for (const table of tables) {
    const result = await client.query(`SELECT COUNT(*)::int AS count FROM ${quoteIdentifier(table)}`);
    if (result.rows[0].count !== 0) {
      throw new Error(`La table PostgreSQL ${table} n’est pas vide ; import annulé sans modifier ses données.`);
    }
  }
}

async function copyTable(source, target, table, sourceColumns, targetColumns) {
  const rows = await sqliteQuery(source, `SELECT * FROM ${quoteIdentifier(table)}`);
  const columns = sourceColumns;
  const missingColumns = columns.filter(column => !targetColumns.has(column));
  if (missingColumns.length > 0) {
    throw new Error(`Colonnes SQLite absentes de la table PostgreSQL ${table} : ${missingColumns.join(', ')}.`);
  }

  if (rows.length === 0) {
    return 0;
  }

  const columnSql = columns.map(quoteIdentifier).join(', ');
  const parameterSql = rows.map((row, rowIndex) => {
    const placeholders = columns.map((_, columnIndex) =>
      `$${rowIndex * columns.length + columnIndex + 1}`
    );
    return `(${placeholders.join(', ')})`;
  }).join(', ');
  const values = rows.flatMap(row => columns.map(column => row[column]));

  await target.query(
    `INSERT INTO ${quoteIdentifier(table)} (${columnSql}) VALUES ${parameterSql}`,
    values
  );
  return rows.length;
}

async function resetSequences(client, tables) {
  for (const table of tables) {
    if (table === 'commandes_backup') {
      continue;
    }

    const primaryKey = await client.query(
      `SELECT a.attname AS column_name
       FROM pg_index i
       JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
       WHERE i.indrelid = $1::regclass AND i.indisprimary
       ORDER BY a.attnum
       LIMIT 1`,
      [quoteIdentifier(table)]
    );

    if (primaryKey.rowCount === 0) {
      continue;
    }

    const column = primaryKey.rows[0].column_name;
    const sequence = await client.query(
      'SELECT pg_get_serial_sequence($1, $2) AS name',
      [quoteIdentifier(table), column]
    );

    if (!sequence.rows[0].name) {
      continue;
    }

    const maximum = await client.query(
      `SELECT MAX(${quoteIdentifier(column)}) AS value FROM ${quoteIdentifier(table)}`
    );
    const maxValue = maximum.rows[0].value;
    await client.query(
      'SELECT setval($1::regclass, $2, $3)',
      [sequence.rows[0].name, maxValue || 1, maxValue !== null]
    );
  }
}

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl || !databaseUrl.startsWith('postgres')) {
    throw new Error('Définissez DATABASE_URL_UNPOOLED (ou DATABASE_URL directe) avec l’URL de destination PostgreSQL.');
  }
  if (new URL(databaseUrl).hostname.includes('-pooler.')) {
    throw new Error('Utilisez DATABASE_URL_UNPOOLED pour la migration, pas la connexion Neon poolée.');
  }
  if (process.env.MIGRATE_SQLITE_TO_POSTGRES !== 'YES') {
    throw new Error('Pour confirmer la migration, définissez MIGRATE_SQLITE_TO_POSTGRES=YES.');
  }
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Fichier SQLite introuvable : ${sourcePath}`);
  }

  const source = new sqlite3.Database(sourcePath, sqlite3.OPEN_READONLY);
  const target = new Client({
    connectionString: databaseUrl,
    ssl: process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: true }
      : undefined
  });

  try {
    const sourceTables = await getSourceTables(source);
    await assertSourceIntegrity(source);
    const tables = sourceTables.filter(table => table !== 'commandes_backup');
    await sequelize.authenticate();
    await sequelize.sync();
    await migrateLegacyColumns();

    if (sourceTables.includes('commandes_backup')) {
      await sequelize.query(
        `CREATE TABLE IF NOT EXISTS ${quoteIdentifier('commandes_backup')} (LIKE ${quoteIdentifier('commandes')} INCLUDING CONSTRAINTS)`
      );
      tables.push('commandes_backup');
    }

    await target.connect();
    const targetForeignKeys = await getTargetForeignKeys(target);
    const orderedTables = await orderTablesByForeignKeys(source, tables, targetForeignKeys);
    const sourceColumnsByTable = new Map();

    for (const table of orderedTables) {
      const columns = await sqliteQuery(source, `PRAGMA table_info(${quoteIdentifier(table)})`);
      sourceColumnsByTable.set(table, columns.map(column => column.name));
    }

    await target.query('BEGIN');
    try {
      await assertTargetIsEmpty(target, orderedTables);

      const copiedCounts = {};
      for (const table of orderedTables) {
        const sourceColumns = sourceColumnsByTable.get(table);
        const targetColumns = await getTargetColumns(target, table);
        const ignoredColumns = sourceColumns.filter(column => !targetColumns.has(column));

        if (ignoredColumns.length > 0) {
          throw new Error(`Colonnes SQLite absentes de la table PostgreSQL ${table} : ${ignoredColumns.join(', ')}.`);
        }

        copiedCounts[table] = await copyTable(
          source,
          target,
          table,
          sourceColumns,
          targetColumns
        );
      }

      await resetSequences(target, orderedTables);
      await target.query('COMMIT');

      for (const [table, count] of Object.entries(copiedCounts)) {
        console.log(`${table}: ${count} ligne(s) copiée(s)`);
      }
      console.log('Migration SQLite vers PostgreSQL terminée.');
    } catch (error) {
      await target.query('ROLLBACK');
      throw error;
    }
  } finally {
    await target.end();
    await sequelize.close();
    await new Promise((resolve, reject) => {
      source.close(error => error ? reject(error) : resolve());
    });
  }
}

migrate().catch(error => {
  console.error('Migration annulée :', error.message);
  process.exitCode = 1;
});
