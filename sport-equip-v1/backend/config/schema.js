const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const legacyColumns = [
  ['commandes', 'id_caisse', { type: DataTypes.INTEGER, allowNull: true }],
  ['commandes', 'montant_rembourse', { type: DataTypes.INTEGER, defaultValue: 0 }],
  ['avis', 'type_avis', { type: DataTypes.STRING, defaultValue: 'produit' }],
  ['avis', 'id_commande', { type: DataTypes.INTEGER, allowNull: true }],
  ['lignes_inventaires', 'id_inventaire', { type: DataTypes.INTEGER, allowNull: true }],
  ['lignes_inventaires', 'id_produit', { type: DataTypes.INTEGER, allowNull: true }]
];

async function migrateLegacyColumns() {
  const queryInterface = sequelize.getQueryInterface();

  for (const [table, column, definition] of legacyColumns) {
    const columns = await queryInterface.describeTable(table);
    if (!columns[column]) {
      await queryInterface.addColumn(table, column, definition);
      console.log(`Colonne ${column} ajoutée à ${table}`);
    }
  }

  if (sequelize.getDialect() === 'postgres') {
    const [columns] = await sequelize.query(
      `SELECT data_type
       FROM information_schema.columns
       WHERE table_schema = current_schema()
         AND table_name = 'demandes_remboursement'
         AND column_name = 'raison'`
    );

    if (columns[0]?.data_type !== 'text') {
      await sequelize.query(
        'ALTER TABLE "demandes_remboursement" ALTER COLUMN "raison" TYPE TEXT USING "raison"::text'
      );
    }
  }
}

module.exports = { migrateLegacyColumns };
