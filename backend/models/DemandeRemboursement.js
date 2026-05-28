const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Commande = require('./Commande');
const Utilisateur = require('./Utilisateur');

const DemandeRemboursement = sequelize.define('DemandeRemboursement', {
  id_demande: {
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
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utilisateur,
      key: 'id_utilisateur'
    }
  },
  type_demande: {
    type: DataTypes.ENUM('remboursement', 'echange'),
    allowNull: false
  },
  raison: {
    type: DataTypes.ENUM('mauvaise_taille', 'mauvaise_couleur', 'article_endommage', 'mauvais_produit', 'autre'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'en_cours', 'approuve', 'refuse', 'traite'),
    defaultValue: 'en_attente'
  },
  date_demande: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_traitement: {
    type: DataTypes.DATE,
    allowNull: true
  },
  montant_rembourse: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes_admin: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'demandes_remboursement',
  timestamps: true,
  underscored: true
});

DemandeRemboursement.belongsTo(Commande, { foreignKey: 'id_commande', as: 'commande' });
DemandeRemboursement.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'utilisateur' });
Commande.hasMany(DemandeRemboursement, { foreignKey: 'id_commande', as: 'demandes' });
Utilisateur.hasMany(DemandeRemboursement, { foreignKey: 'id_utilisateur', as: 'demandes' });

module.exports = DemandeRemboursement;
