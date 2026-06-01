const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../sport-equip.sqlite'));

const commandes = db.prepare("SELECT * FROM commandes WHERE statut IN ('Payée', 'Livrée')").all();
console.log('Commandes Payée/Livrée:', JSON.stringify(commandes, null, 2));

const allCommandes = db.prepare('SELECT * FROM commandes').all();
console.log('Toutes les commandes:', JSON.stringify(allCommandes, null, 2));
