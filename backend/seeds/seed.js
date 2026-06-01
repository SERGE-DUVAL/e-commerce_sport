const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

async function seed() {
  try {
    // Disable foreign keys for deletion
    db.pragma('foreign_keys = OFF');

    // Clear existing data
    db.exec('DELETE FROM avis');
    db.exec('DELETE FROM ligne_commandes');
    db.exec('DELETE FROM commandes');
    db.exec('DELETE FROM promotions');
    db.exec('DELETE FROM produits');
    db.exec('DELETE FROM utilisateurs');
    
    // Re-enable foreign keys
    db.pragma('foreign_keys = ON');
    
    console.log('Base de données réinitialisée');

    // Créer un admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare(`
      INSERT INTO utilisateurs (nom, email, mot_de_passe, role, points_fidelite, created_at, updated_at)
      VALUES (?, ?, ?, 'admin', 0, datetime('now'), datetime('now'))
    `).run('Administrateur', 'admin@sportequip.com', hashedPassword);

    // Créer un client test
    const clientPassword = await bcrypt.hash('client123', 10);
    db.prepare(`
      INSERT INTO utilisateurs (nom, email, mot_de_passe, role, points_fidelite, adresse_livraison, created_at, updated_at)
      VALUES (?, ?, ?, 'client', 500, ?, datetime('now'), datetime('now'))
    `).run('Client Test', 'client@test.com', clientPassword, 'Yaoundé, Cameroun');

    // Créer 20 produits
    const produits = [
      {
        titre: 'Maillot Football Pro',
        description: 'Maillot professionnel en polyester respirant',
        categorie: 'Football',
        prix_xaf: 25000,
        stock: 50,
        variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Rouge', 'Bleu', 'Blanc'] })
      },
      {
        titre: 'Crampons Mercurial',
        description: 'Chaussures de football haute performance',
        categorie: 'Football',
        prix_xaf: 45000,
        stock: 30,
        variantes: JSON.stringify({ tailles: ['38', '39', '40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc'] })
      },
      {
        titre: 'Ballon Football Official',
        description: 'Ballon officiel FIFA qualité match',
        categorie: 'Football',
        prix_xaf: 35000,
        stock: 25,
        variantes: JSON.stringify({ tailles: ['4', '5'], couleurs: ['Blanc/Noir', 'Jaune'] })
      },
      {
        titre: 'Gants Gardien Pro',
        description: 'Gants avec grip amélioré et protection',
        categorie: 'Football',
        prix_xaf: 18000,
        stock: 40,
        variantes: JSON.stringify({ tailles: ['7', '8', '9', '10'], couleurs: ['Noir', 'Vert', 'Rouge'] })
      },
      {
        titre: 'Short Running Elite',
        description: 'Short léger avec poche zippée',
        categorie: 'Running',
        prix_xaf: 15000,
        stock: 60,
        variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Noir', 'Bleu', 'Gris'] })
      },
      {
        titre: 'Chaussures Running Ultra',
        description: 'Running shoes avec amorti maximal',
        categorie: 'Running',
        prix_xaf: 55000,
        stock: 35,
        variantes: JSON.stringify({ tailles: ['38', '39', '40', '41', '42', '43', '44'], couleurs: ['Noir', 'Blanc', 'Rouge'] })
      },
      {
        titre: 'T-shirt Technique Dry',
        description: 'T-shirt respirant anti-transpiration',
        categorie: 'Running',
        prix_xaf: 12000,
        stock: 80,
        variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Blanc', 'Noir', 'Bleu', 'Jaune'] })
      },
      {
        titre: 'Montre GPS Running',
        description: 'Montre connectée avec GPS et cardio',
        categorie: 'Running',
        prix_xaf: 75000,
        stock: 20,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Blanc'] })
      },
      {
        titre: 'Haltères Réglables 20kg',
        description: 'Set d\'haltères ajustables pour fitness',
        categorie: 'Fitness',
        prix_xaf: 65000,
        stock: 15,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Rouge'] })
      },
      {
        titre: 'Tapis de Yoga Premium',
        description: 'Tapis antidérapant épaisseur 8mm',
        categorie: 'Fitness',
        prix_xaf: 22000,
        stock: 45,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Bleu', 'Rose', 'Vert', 'Violet'] })
      },
      {
        titre: 'Elastique Résistance',
        description: 'Bandes élastiques pour renforcement',
        categorie: 'Fitness',
        prix_xaf: 8000,
        stock: 100,
        variantes: JSON.stringify({ tailles: ['Léger', 'Moyen', 'Fort'], couleurs: ['Jaune', 'Rouge', 'Bleu'] })
      },
      {
        titre: 'Step Aerobic',
        description: 'Plateforme step ajustable',
        categorie: 'Fitness',
        prix_xaf: 35000,
        stock: 25,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Gris', 'Noir'] })
      },
      {
        titre: 'Raquette Tennis Pro',
        description: 'Raquette carbone pour joueurs avancés',
        categorie: 'Tennis',
        prix_xaf: 85000,
        stock: 20,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Rouge', 'Bleu', 'Noir'] })
      },
      {
        titre: 'Balle Tennis 3-pack',
        description: 'Lot de 3 balles pression',
        categorie: 'Tennis',
        prix_xaf: 12000,
        stock: 70,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Jaune/Vert'] })
      },
      {
        titre: 'Sac Tennis Tour',
        description: 'Sac pour 6 raquettes avec compartiments',
        categorie: 'Tennis',
        prix_xaf: 40000,
        stock: 30,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Rouge', 'Bleu'] })
      },
      {
        titre: 'Chaussures Basketball Air',
        description: 'Basket avec technologie air cushion',
        categorie: 'Basketball',
        prix_xaf: 60000,
        stock: 25,
        variantes: JSON.stringify({ tailles: ['40', '41', '42', '43', '44', '45'], couleurs: ['Noir/Rouge', 'Blanc/Bleu'] })
      },
      {
        titre: 'Ballon Basketball Official',
        description: 'Ballon NBA taille officielle',
        categorie: 'Basketball',
        prix_xaf: 28000,
        stock: 35,
        variantes: JSON.stringify({ tailles: ['6', '7'], couleurs: ['Orange', 'Marron'] })
      },
      {
        titre: 'Maillot Basketball Jersey',
        description: 'Maillot respirant pour match',
        categorie: 'Basketball',
        prix_xaf: 20000,
        stock: 50,
        variantes: JSON.stringify({ tailles: ['S', 'M', 'L', 'XL'], couleurs: ['Rouge', 'Bleu', 'Noir', 'Blanc'] })
      },
      {
        titre: 'Protège-Tibia Pro',
        description: 'Protège-tibias avec coque rigide',
        categorie: 'Football',
        prix_xaf: 10000,
        stock: 60,
        variantes: JSON.stringify({ tailles: ['S', 'M', 'L'], couleurs: ['Noir', 'Blanc', 'Bleu'] })
      },
      {
        titre: 'Gourde Isotermique 1L',
        description: 'Gourde garde température 24h',
        categorie: 'Running',
        prix_xaf: 15000,
        stock: 55,
        variantes: JSON.stringify({ tailles: ['Unique'], couleurs: ['Noir', 'Bleu', 'Rouge', 'Vert'] })
      }
    ];

    const insertProduit = db.prepare(`
      INSERT INTO produits (titre, description, categorie, prix_xaf, stock, variantes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    produits.forEach(p => {
      insertProduit.run(p.titre, p.description, p.categorie, p.prix_xaf, p.stock, p.variantes);
    });

    console.log('20 produits créés avec succès');

    // Créer des promotions
    db.prepare(`
      INSERT INTO promotions (code, pourcentage_remise, est_active, date_expiration, created_at, updated_at)
      VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
    `).run('KEYCE20', 20, '2026-12-31');

    db.prepare(`
      INSERT INTO promotions (code, pourcentage_remise, est_active, date_expiration, created_at, updated_at)
      VALUES (?, ?, 1, ?, datetime('now'), datetime('now'))
    `).run('SOMMER10', 10, '2026-08-31');

    console.log('Promotions créées avec succès');
    console.log('Seed terminé avec succès!');

  } catch (error) {
    console.error('Erreur lors du seed:', error);
  }
}

seed();
