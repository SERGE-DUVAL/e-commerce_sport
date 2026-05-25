const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');

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
    type: Sequelize.ENUM('Mobile Money', 'PayPal', 'Cash', 'Points'),
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
    type: Sequelize.ENUM('En attente', 'Payée', 'Livrée', 'Annulée'),
    defaultValue: 'En attente'
  }
}, {
  tableName: 'commandes',
  timestamps: true
});

Commande.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });
Utilisateur.hasMany(Commande, { foreignKey: 'id_utilisateur' });

module.exports = Commande;
