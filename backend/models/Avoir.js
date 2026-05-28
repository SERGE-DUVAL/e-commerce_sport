const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Commande = require('./Commande');
const Utilisateur = require('./Utilisateur');

const Avoir = sequelize.define('Avoir', {
  id_avoir: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_avoir: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  montant: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  motif: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date_emission: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  date_expiration: {
    type: Sequelize.DATE
  },
  statut: {
    type: Sequelize.ENUM('en attente', 'utilisé', 'expiré', 'annulé'),
    defaultValue: 'en attente'
  },
  notes: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'avoirs',
  timestamps: true
});

Avoir.belongsTo(Commande, { foreignKey: 'id_commande', as: 'commande' });
Commande.hasMany(Avoir, { foreignKey: 'id_commande', as: 'avoirs' });

Avoir.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'utilisateur' });
Utilisateur.hasMany(Avoir, { foreignKey: 'id_utilisateur', as: 'avoirs' });

module.exports = Avoir;
