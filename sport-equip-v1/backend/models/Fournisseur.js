const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Fournisseur = sequelize.define('Fournisseur', {
  id_fournisseur: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contact: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  telephone: {
    type: Sequelize.STRING
  },
  adresse: {
    type: Sequelize.TEXT
  },
  ville: {
    type: Sequelize.STRING
  },
  pays: {
    type: Sequelize.STRING,
    defaultValue: 'Cameroun'
  },
  delai_livraison: {
    type: Sequelize.INTEGER,
    defaultValue: 7
  },
  conditions_paiement: {
    type: Sequelize.STRING,
    defaultValue: '30 jours'
  },
  notes: {
    type: Sequelize.TEXT
  },
  actif: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fournisseurs',
  timestamps: true
});

module.exports = Fournisseur;
