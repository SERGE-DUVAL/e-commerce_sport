const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../sport-equip.sqlite');
const db = new Database(dbPath, { readonly: true });

console.log('=== EXAMEN DE LA BASE DE DONNÉES ===');
console.log('Chemin:', dbPath);
console.log('');

// Lister les tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

console.log('=== TABLES ===');
tables.forEach(table => {
  console.log('-', table.name);
});
console.log('');

// Examiner chaque table
for (const table of tables) {
  const tableName = table.name;
  
  console.log(`=== TABLE: ${tableName} ===`);
  
  // Structure
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  columns.forEach(col => {
    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
  });
  
  // Nombre d'enregistrements
  const countResult = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
  console.log(`  Total enregistrements: ${countResult.count}`);
  
  // Afficher quelques exemples
  if (countResult.count > 0) {
    const rows = db.prepare(`SELECT * FROM ${tableName} LIMIT 3`).all();
    if (rows.length > 0) {
      console.log('  Exemples:');
      rows.forEach((row, i) => {
        console.log(`    ${i + 1}:`, JSON.stringify(row, null, 2).split('\n').join('\n    '));
      });
    }
  }
  
  console.log('');
}

console.log('=== EXAMEN TERMINÉ ===');
db.close();
