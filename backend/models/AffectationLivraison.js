const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Commande = require('./Commande');
const Livreur = require('./Livreur');

const AffectationLivraison = sequelize.define('AffectationLivraison', {
  id_affectation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_commande: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Commande,
      key: 'id_commande'
    }
  },
  id_livreur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Livreur,
      key: 'id_livreur'
    }
  },
  date_affectation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_livraison_prevue: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_livraison_reelle: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('en attente', 'en cours', 'livrée', 'annulée'),
    defaultValue: 'en attente'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  conditions_meteo: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'affectations_livraison',
  timestamps: true,
  underscored: true
});

AffectationLivraison.belongsTo(Commande, { foreignKey: 'id_commande', as: 'commande' });
AffectationLivraison.belongsTo(Livreur, { foreignKey: 'id_livreur', as: 'livreur' });
Commande.hasMany(AffectationLivraison, { foreignKey: 'id_commande', as: 'affectations' });
Livreur.hasMany(AffectationLivraison, { foreignKey: 'id_livreur', as: 'affectations' });

module.exports = AffectationLivraison;
