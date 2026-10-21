const db = require('../config/database');
const { Utilisateur, Produit, Promotion } = require('../models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await db.sync({ force: true });
    console.log('Base de données réinitialisée');

    // Créer un admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Utilisateur.create({
      nom: 'Administrateur',
      email: 'admin@sportequip.com',
      mot_de_passe: hashedPassword,
      role: 'admin',
      points_fidelite: 0
    });

    // Créer un client test
    const clientPassword = await bcrypt.hash('client123', 10);
    await Utilisateur.create({
      nom: 'Client Test',
      email: 'client@test.com',
      mot_de_passe: clientPassword,
      role: 'client',
      points_fidelite: 500,
      adresse_livraison: 'Yaoundé, Cameroun'
    });

    // Créer 20 produits
    const produits = [];

    await Produit.bulkCreate(produits);
    console.log('0 produits créés avec succès');

    // Créer des promotions
    await Promotion.create({
      code: 'KEYCE20',
      pourcentage_remise: 20,
      est_active: true,
      date_expiration: new Date('2026-12-31')
    });

    await Promotion.create({
      code: 'SOMMER10',
      pourcentage_remise: 10,
      est_active: true,
      date_expiration: new Date('2026-08-31')
    });

    console.log('Promotions créées avec succès');
    console.log('Seed terminé avec succès!');

  } catch (error) {
    console.error('Erreur lors du seed:', error);
  }
}

seed();
