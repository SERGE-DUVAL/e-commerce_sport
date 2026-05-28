const sequelize = require('../config/database');
const { Livreur, AffectationLivraison, Commande, Utilisateur, DemandeRemboursement, Avis } = require('../models');

async function seedDeliveryRefunds() {
  try {
    await sequelize.sync();

    // Créer des livreurs
    const livreurs = await Livreur.bulkCreate([
      {
        nom: 'Dupont',
        prenom: 'Jean',
        telephone: '+237 699 123 456',
        email: 'jean.dupont@sportequip.com',
        vehicule: 'Moto',
        plaque_immatriculation: 'CE 123 AB',
        statut: 'disponible',
        latitude: 3.8488,
        longitude: 11.5028,
        derniere_mise_a_jour_gps: new Date()
      },
      {
        nom: 'Martin',
        prenom: 'Marie',
        telephone: '+237 699 234 567',
        email: 'marie.martin@sportequip.com',
        vehicule: 'Moto',
        plaque_immatriculation: 'CE 456 CD',
        statut: 'disponible',
        latitude: 3.8588,
        longitude: 11.5128,
        derniere_mise_a_jour_gps: new Date()
      },
      {
        nom: 'Ngom',
        prenom: 'Pierre',
        telephone: '+237 699 345 678',
        email: 'pierre.ngom@sportequip.com',
        vehicule: 'Scooter',
        plaque_immatriculation: 'CE 789 EF',
        statut: 'en livraison',
        latitude: 3.8688,
        longitude: 11.5228,
        derniere_mise_a_jour_gps: new Date()
      },
      {
        nom: 'Faye',
        prenom: 'Aminata',
        telephone: '+237 699 456 789',
        email: 'aminata.faye@sportequip.com',
        vehicule: 'Moto',
        plaque_immatriculation: 'CE 012 GH',
        statut: 'disponible',
        latitude: 3.8788,
        longitude: 11.5328,
        derniere_mise_a_jour_gps: new Date()
      },
      {
        nom: 'Kouame',
        prenom: 'Kofi',
        telephone: '+237 699 567 890',
        email: 'kofi.kouame@sportequip.com',
        vehicule: 'Scooter',
        plaque_immatriculation: 'CE 345 IJ',
        statut: 'disponible',
        latitude: 3.8888,
        longitude: 11.5428,
        derniere_mise_a_jour_gps: new Date()
      }
    ]);

    console.log(`${livreurs.length} livreurs créés`);

    // Récupérer les commandes existantes
    const commandes = await Commande.findAll({ limit: 3 });

    // Créer des affectations de livraison
    const affectations = await AffectationLivraison.bulkCreate([
      {
        id_commande: commandes[0]?.id_commande || 1,
        id_livreur: livreurs[0].id_livreur,
        date_affectation: new Date(),
        date_livraison_prevue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        statut: 'en_cours',
        conditions_meteo: 'Ensoleillé',
        distance_km: 5.2
      },
      {
        id_commande: commandes[1]?.id_commande || 2,
        id_livreur: livreurs[1].id_livreur,
        date_affectation: new Date(),
        date_livraison_prevue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        statut: 'en_cours',
        conditions_meteo: 'Nuageux',
        distance_km: 3.8
      }
    ]);

    console.log(`${affectations.length} affectations créées`);

    // Récupérer les utilisateurs existants
    const utilisateurs = await Utilisateur.findAll({ where: { role: 'client' }, limit: 3 });

    // Créer des demandes de remboursement
    const demandes = await DemandeRemboursement.bulkCreate([
      {
        id_commande: commandes[0]?.id_commande || 1,
        id_utilisateur: utilisateurs[0]?.id_utilisateur || 1,
        type_demande: 'remboursement',
        raison: 'Produit défectueux',
        description: 'Le produit reçu est défectueux et ne fonctionne pas correctement',
        statut: 'en_attente',
        date_demande: new Date()
      },
      {
        id_commande: commandes[1]?.id_commande || 2,
        id_utilisateur: utilisateurs[1]?.id_utilisateur || 2,
        type_demande: 'echange',
        raison: 'Taille incorrecte',
        description: 'La taille ne correspond pas à celle commandée',
        statut: 'approuve',
        date_demande: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        montant_rembourse: 0,
        notes_admin: 'Échange autorisé'
      },
      {
        id_commande: commandes[2]?.id_commande || 3,
        id_utilisateur: utilisateurs[2]?.id_utilisateur || 3,
        type_demande: 'remboursement',
        raison: 'Produit ne correspond pas à la description',
        description: 'Le produit reçu ne correspond pas à la description sur le site',
        statut: 'refuse',
        date_demande: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes_admin: 'Produit conforme à la description'
      }
    ]);

    console.log(`${demandes.length} demandes de remboursement créées`);

    // Récupérer les produits existants
    const produits = await require('./seedProducts').getProduits || [];
    const produitsExistant = await require('../models').Produit.findAll({ limit: 5 });

    // Créer des avis
    const avis = await Avis.bulkCreate([
      {
        id_produit: produitsExistant[0]?.id_produit || 1,
        id_utilisateur: utilisateurs[0]?.id_utilisateur || 1,
        note: 5,
        commentaire: 'Excellent produit, très bonne qualité. Je recommande vivement !',
        date_avis: new Date()
      },
      {
        id_produit: produitsExistant[1]?.id_produit || 2,
        id_utilisateur: utilisateurs[1]?.id_utilisateur || 2,
        note: 4,
        commentaire: 'Bon produit mais livraison un peu lente. Sinon tout est parfait.',
        date_avis: new Date()
      },
      {
        id_produit: produitsExistant[2]?.id_produit || 3,
        id_utilisateur: utilisateurs[2]?.id_utilisateur || 3,
        note: 5,
        commentaire: 'Super qualité, correspond exactement à mes attentes. Merci Sport-Equip !',
        date_avis: new Date()
      },
      {
        id_produit: produitsExistant[0]?.id_produit || 1,
        id_utilisateur: utilisateurs[1]?.id_utilisateur || 2,
        note: 3,
        commentaire: 'Produit correct mais un peu cher par rapport à la qualité.',
        date_avis: new Date()
      },
      {
        id_produit: produitsExistant[3]?.id_produit || 4,
        id_utilisateur: utilisateurs[0]?.id_utilisateur || 1,
        note: 4,
        commentaire: 'Bon rapport qualité/prix. Je recommande.',
        date_avis: new Date()
      }
    ]);

    console.log(`${avis.length} avis créés`);

    console.log('Seed terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDeliveryRefunds();
