const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../sport-equip.sqlite'));

const tables = [
  'utilisateurs',
  'produits',
  'commandes',
  'ligne_commandes',
  'lignes_commandes',
  'promotions',
  'avis',
  'livreurs',
  'affectations_livraison',
  'demandes_remboursement',
  'fournisseurs',
  'zones_stockage',
  'caisses',
  'inventaires',
  'lignes_inventaires',
  'avoirs',
  'codes_barres',
  'mouvements_stock',
  'notifications_stock'
];

tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    console.log(`${table}: ${count.count} rows`);
  } catch (e) {
    console.log(`${table}: Error - ${e.message}`);
  }
});
