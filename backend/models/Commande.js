const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Caisse = require('./Caisse');

const Commande = sequelize.define('Commande', {
  id_commande: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total_xaf: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  moyen_paiement: {
    type: Sequelize.ENUM('Mobile Money', 'PayPal', 'Cash', 'Points', 'Carte bancaire', 'Chèque'),
    allowNull: false
  },
  frais_livraison: {
    type: Sequelize.INTEGER,
    defaultValue: 3000
  },
  points_utilises: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  remise_appliquee: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  adresse_livraison: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  statut: {
    type: Sequelize.ENUM('En attente', 'Payée', 'En livraison', 'Livrée', 'Annulée'),
    defaultValue: 'En attente'
  },
  id_caisse: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  montant_rembourse: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'commandes',
  timestamps: true
});

Commande.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'Utilisateur' });
Utilisateur.hasMany(Commande, { foreignKey: 'id_utilisateur', as: 'Commandes' });
Commande.belongsTo(Caisse, { foreignKey: 'id_caisse', as: 'caisse' });
Caisse.hasMany(Commande, { foreignKey: 'id_caisse', as: 'commandes' });

// Association différée avec Avis pour éviter la dépendance circulaire
// Définie dans models/index.js après le chargement de tous les modèles

module.exports = Commande;
