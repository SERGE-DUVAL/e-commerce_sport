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
    const produits = [
      {
        titre: 'Maillot Football Pro',
        description: 'Maillot professionnel en polyester respirant',
        categorie: 'Football',
        prix_xaf: 25000,
        stock: 50,
        variantes: { tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Rouge', 'Bleu', 'Blanc'] }
      },
      {
        titre: 'Crampons Mercurial',
        description: 'Chaussures de football haute performance',
        categorie: 'Football',
        prix_xaf: 45000,
        stock: 30,
        variantes: { tailles: ['38', '39', '40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc'] }
      },
      {
        titre: 'Ballon Football Official',
        description: 'Ballon officiel FIFA qualité match',
        categorie: 'Football',
        prix_xaf: 35000,
        stock: 25,
        variantes: { tailles: ['4', '5'], couleurs: ['Blanc/Noir', 'Jaune'] }
      },
      {
        titre: 'Gants Gardien Pro',
        description: 'Gants avec grip amélioré et protection',
        categorie: 'Football',
        prix_xaf: 18000,
        stock: 40,
        variantes: { tailles: ['7', '8', '9', '10'], couleurs: ['Noir', 'Vert', 'Rouge'] }
      },
      {
        titre: 'Short Running Elite',
        description: 'Short léger avec poche zippée',
        categorie: 'Running',
        prix_xaf: 15000,
        stock: 60,
        variantes: { tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Noir', 'Bleu', 'Gris'] }
      },
      {
        titre: 'Chaussures Running Ultra',
        description: 'Running shoes avec amorti maximal',
        categorie: 'Running',
        prix_xaf: 55000,
        stock: 35,
        variantes: { tailles: ['38', '39', '40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc', 'Rouge'] }
      },
      {
        titre: 'T-shirt Technique Dry',
        description: 'T-shirt respirant anti-transpiration',
        categorie: 'Running',
        prix_xaf: 12000,
        stock: 80,
        variantes: { tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Blanc', 'Noir', 'Bleu', 'Jaune'] }
      },
      {
        titre: 'Montre GPS Running',
        description: 'Montre connectée avec GPS et cardio',
        categorie: 'Running',
        prix_xaf: 75000,
        stock: 20,
        variantes: { tailles: ['Unique'], couleurs: ['Noir', 'Blanc'] }
      },
      {
        titre: 'Haltères Réglables 20kg',
        description: 'Set d\'haltères ajustables pour fitness',
        categorie: 'Fitness',
        prix_xaf: 65000,
        stock: 15,
        variantes: { tailles: ['Unique'], couleurs: ['Noir', 'Rouge'] }
      },
      {
        titre: 'Tapis de Yoga Premium',
        description: 'Tapis antidérapant épaisseur 8mm',
        categorie: 'Fitness',
        prix_xaf: 22000,
        stock: 45,
        variantes: { tailles: ['Unique'], couleurs: ['Bleu', 'Rose', 'Vert', 'Violet'] }
      },
      {
        titre: 'Elastique Résistance',
        description: 'Bandes élastiques pour renforcement',
        categorie: 'Fitness',
        prix_xaf: 8000,
        stock: 100,
        variantes: { tailles: ['Léger', 'Moyen', 'Fort'], couleurs: ['Jaune', 'Rouge', 'Bleu'] }
      },
      {
        titre: 'Step Aerobic',
        description: 'Plateforme step ajustable',
        categorie: 'Fitness',
        prix_xaf: 35000,
        stock: 25,
        variantes: { tailles: ['Unique'], couleurs: ['Gris', 'Noir'] }
      },
      {
        titre: 'Raquette Tennis Pro',
        description: 'Raquette carbone pour joueurs avancés',
        categorie: 'Tennis',
        prix_xaf: 85000,
        stock: 20,
        variantes: { tailles: ['Unique'], couleurs: ['Rouge', 'Bleu', 'Noir'] }
      },
      {
        titre: 'Balle Tennis 3-pack',
        description: 'Lot de 3 balles pression',
        categorie: 'Tennis',
        prix_xaf: 12000,
        stock: 70,
        variantes: { tailles: ['Unique'], couleurs: ['Jaune/Vert'] }
      },
      {
        titre: 'Sac Tennis Tour',
        description: 'Sac pour 6 raquettes avec compartiments',
        categorie: 'Tennis',
        prix_xaf: 40000,
        stock: 30,
        variantes: { tailles: ['Unique'], couleurs: ['Noir', 'Rouge', 'Bleu'] }
      },
      {
        titre: 'Chaussures Basketball Air',
        description: 'Basket avec technologie air cushion',
        categorie: 'Basketball',
        prix_xaf: 60000,
        stock: 25,
        variantes: { tailles: ['40', '41', '42', '43', '44', '45'], couleurs: ['Noir/Rouge', 'Blanc/Bleu'] }
      },
      {
        titre: 'Ballon Basketball Official',
        description: 'Ballon NBA taille officielle',
        categorie: 'Basketball',
        prix_xaf: 28000,
        stock: 35,
        variantes: { tailles: ['6', '7'], couleurs: ['Orange', 'Marron'] }
      },
      {
        titre: 'Maillot Basketball Jersey',
        description: 'Maillot respirant pour match',
        categorie: 'Basketball',
        prix_xaf: 20000,
        stock: 50,
        variantes: { tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Rouge', 'Bleu', 'Noir', 'Blanc'] }
      },
      {
        titre: 'Protège-Tibia Pro',
        description: 'Protège-tibias avec coque rigide',
        categorie: 'Football',
        prix_xaf: 10000,
        stock: 60,
        variantes: { tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Blanc', 'Bleu'] }
      },
      {
        titre: 'Gourde Isotermique 1L',
        description: 'Gourde garde température 24h',
        categorie: 'Running',
        prix_xaf: 15000,
        stock: 55,
        variantes: { tailles: ['Unique'], couleurs: ['Noir', 'Bleu', 'Rouge', 'Vert'] }
      }
    ];

    await Produit.bulkCreate(produits);
    console.log('20 produits créés avec succès');

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
