require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/refunds', require('./routes/refunds'));
app.use('/api/barcode', require('./routes/barcode'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/credits', require('./routes/credits'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/cash', require('./routes/cash'));

// Sync database
const db = require('./config/database');
db.sync({ force: false })
  .then(async () => {
    console.log('Base de données SQLite synchronisée');

    // Migration manuelle pour ajouter les nouvelles colonnes
    try {
      await db.query('ALTER TABLE commandes ADD COLUMN id_caisse INTEGER');
      console.log('Colonne id_caisse ajoutée à commandes');
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Erreur ajout id_caisse:', err.message);
      }
    }

    try {
      await db.query('ALTER TABLE commandes ADD COLUMN montant_rembourse INTEGER DEFAULT 0');
      console.log('Colonne montant_rembourse ajoutée à commandes');
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Erreur ajout montant_rembourse:', err.message);
      }
    }

    try {
      await db.query('ALTER TABLE avis ADD COLUMN type_avis TEXT DEFAULT "produit"');
      console.log('Colonne type_avis ajoutée à avis');
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Erreur ajout type_avis:', err.message);
      }
    }

    try {
      await db.query('ALTER TABLE avis ADD COLUMN id_commande INTEGER');
      console.log('Colonne id_commande ajoutée à avis');
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Erreur ajout id_commande:', err.message);
      }
    }
  })
  .catch(err => {
    console.error('Erreur de synchronisation BDD:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
