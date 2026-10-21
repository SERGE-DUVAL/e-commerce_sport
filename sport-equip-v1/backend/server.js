const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const bcrypt = require('bcrypt');
const db = require('./config/database');
const { migrateLegacyColumns } = require('./config/schema');
const { Utilisateur } = require('./models');

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
