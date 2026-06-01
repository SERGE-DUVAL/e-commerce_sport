const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../sport-equip.sqlite'));

const avis = db.prepare('SELECT * FROM avis').all();
console.log('Avis:', JSON.stringify(avis, null, 2));

const avisCount = db.prepare('SELECT COUNT(*) as count FROM avis').get().count;
console.log('Nombre d\'avis:', avisCount);
