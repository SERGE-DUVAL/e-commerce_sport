const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

async function seedComplete() {
  try {
    console.log('Début du seed complet...');

    // Disable foreign keys for insertion
    db.pragma('foreign_keys = OFF');

    // ============ COMMANDES ============
    const commandesCount = db.prepare('SELECT COUNT(*) as count FROM commandes').get().count;
    if (commandesCount < 15) {
      console.log('Ajout des commandes...');
      const utilisateurs = db.prepare("SELECT id_utilisateur FROM utilisateurs WHERE role = 'client'").all();
      const produits = db.prepare('SELECT id_produit, prix_xaf, stock FROM produits LIMIT 10').all();
      
      const statuts = ['En attente', 'Payée', 'Livrée', 'Annulée'];
      const moyens_paiement = ['Carte bancaire', 'Mobile Money', 'Espèces', 'Virement'];

      for (let i = 0; i < 15; i++) {
        const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
        const statut = statuts[Math.floor(Math.random() * statuts.length)];
        const moyen_paiement = moyens_paiement[Math.floor(Math.random() * moyens_paiement.length)];
        
        // Créer des lignes de commande pour cette commande
        const numProduits = Math.floor(Math.random() * 3) + 1;
        const selectedProduits = [];
        let total = 0;
        
        for (let j = 0; j < numProduits; j++) {
          const produit = produits[Math.floor(Math.random() * produits.length)];
          const quantite = Math.floor(Math.random() * 3) + 1;
          total += produit.prix_xaf * quantite;
          selectedProduits.push({ produit, quantite });
        }

        const insertCommande = db.prepare(`
          INSERT INTO commandes (id_utilisateur, total_xaf, statut, moyen_paiement, adresse_livraison, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run(
          utilisateur.id_utilisateur,
          total,
          statut,
          moyen_paiement,
          'Yaoundé, Cameroun'
        );

        // Ajouter les lignes de commande
        const insertLigne = db.prepare(`
          INSERT INTO ligne_commandes (id_commande, id_produit, quantite, prix_unitaire_achat, created_at, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        selectedProduits.forEach(({ produit, quantite }) => {
          insertLigne.run(insertCommande.lastInsertRowid, produit.id_produit, quantite, produit.prix_xaf);
        });
      }
      console.log('15 commandes ajoutées');
    } else {
      console.log('Commandes déjà présentes');
    }

    // ============ AVIS ============
    const avisCount = db.prepare('SELECT COUNT(*) as count FROM avis').get().count;
    if (avisCount < 20) {
      console.log('Ajout des avis...');
      const utilisateurs = db.prepare("SELECT id_utilisateur FROM utilisateurs WHERE role = 'client'").all();
      const produits = db.prepare('SELECT id_produit FROM produits LIMIT 15').all();
      const commandes = db.prepare('SELECT id_commande FROM commandes LIMIT 10').all();
      
      const commentaires = [
        'Excellent produit, très satisfait!',
        'Bon rapport qualité-prix',
        'Produit conforme à la description',
        'Livraison rapide, je recommande',
        'Qualité moyenne mais correct',
        'Très bon produit, merci!',
        'Déçu par la qualité',
        'Parfait pour mon usage',
        'Un peu cher mais bon',
        'Super qualité, top!'
      ];

      for (let i = 0; i < 20; i++) {
        const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
        const produit = produits[Math.floor(Math.random() * produits.length)];
        const commande = commandes[Math.floor(Math.random() * commandes.length)];
        const note = Math.floor(Math.random() * 3) + 3; // 3 à 5
        const commentaire = commentaires[Math.floor(Math.random() * commentaires.length)];
        const type_avis = Math.random() > 0.5 ? 'produit' : 'livraison';

        try {
          db.prepare(`
            INSERT INTO avis (id_produit, id_utilisateur, id_commande, note, commentaire, type_avis, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `).run(produit.id_produit, utilisateur.id_utilisateur, commande.id_commande, note, commentaire, type_avis);
        } catch (e) {
          // Ignore duplicate errors
        }
      }
      console.log('20 avis ajoutés');
    } else {
      console.log('Avis déjà présents');
    }

    // ============ NOTIFICATIONS STOCK ============
    const notificationsCount = db.prepare('SELECT COUNT(*) as count FROM notifications_stock').get().count;
    if (notificationsCount === 0) {
      console.log('Ajout des notifications de stock...');
      const produits = db.prepare('SELECT id_produit, titre, stock FROM produits WHERE stock < 10').all();
      const utilisateurs = db.prepare("SELECT id_utilisateur, email FROM utilisateurs WHERE role = 'admin'").all();
      
      const statuts = ['en attente', 'envoyé', 'lu'];
      const messages = [
        'Stock faible, veuillez réapprovisionner',
        'Stock critique, action requise',
        'Produit bientôt en rupture',
        'Alerte stock minimum atteint'
      ];

      produits.forEach(produit => {
        const utilisateur = utilisateurs[Math.floor(Math.random() * utilisateurs.length)];
        const statut = statuts[Math.floor(Math.random() * statuts.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        db.prepare(`
          INSERT INTO notifications_stock (id_utilisateur, id_produit, email, statut, created_at, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run(utilisateur.id_utilisateur, produit.id_produit, utilisateur.email, statut);
      });
      console.log(`${produits.length} notifications de stock ajoutées`);
    } else {
      console.log('Notifications de stock déjà présentes');
    }

    // Re-enable foreign keys
    db.pragma('foreign_keys = ON');

    console.log('Seed complet terminé avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed complet:', error);
    process.exit(1);
  }
}

seedComplete();
