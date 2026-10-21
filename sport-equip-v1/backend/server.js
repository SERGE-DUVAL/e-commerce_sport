const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./config/database');
const { migrateLegacyColumns } = require('./config/schema');
const { Utilisateur } = require('./models');

const app = express();
const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET doit être défini dans les variables d’environnement.');
}

if (process.env.NODE_ENV === 'production' && frontendOrigins.length === 0) {
  throw new Error('FRONTEND_URL doit être défini en production.');
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || frontendOrigins.length === 0 || frontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origine non autorisée par CORS.'));
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Vérification de santé de la base de données échouée:', error);
    res.status(503).json({ status: 'unavailable' });
  }
});

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
app.use('/api/supply', require('./routes/supply'));

app.use((error, req, res, next) => {
  if (error.message === 'Origine non autorisée par CORS.') {
    return res.status(403).json({ message: error.message });
  }

  return next(error);
});

async function createInitialAdmin() {
  const adminCount = await Utilisateur.count({ where: { role: 'admin' } });
  if (adminCount > 0) {
    return;
  }

  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Aucun administrateur existe. Définissez INITIAL_ADMIN_EMAIL et INITIAL_ADMIN_PASSWORD pour le premier démarrage.'
      );
    }

    console.warn('Aucun administrateur configuré. Définissez INITIAL_ADMIN_EMAIL et INITIAL_ADMIN_PASSWORD.');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12) {
    throw new Error('INITIAL_ADMIN_EMAIL doit être valide et INITIAL_ADMIN_PASSWORD doit contenir au moins 12 caractères.');
  }

  if (await Utilisateur.findOne({ where: { email } })) {
    throw new Error('INITIAL_ADMIN_EMAIL est déjà associé à un compte non administrateur.');
  }

  await Utilisateur.create({
    nom: 'Administrateur',
    email,
    mot_de_passe: await bcrypt.hash(password, 12),
    role: 'admin',
    points_fidelite: 0
  });
  console.log(`Compte administrateur initial créé pour ${email}`);
}

async function start() {
  await db.authenticate();
  await db.sync();
  await migrateLegacyColumns();
  await createInitialAdmin();

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

start().catch(async error => {
  console.error('Échec du démarrage du serveur:', error);
  await db.close();
  process.exitCode = 1;
});
