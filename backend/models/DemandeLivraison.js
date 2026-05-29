const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DemandeLivraison = sequelize.define('DemandeLivraison', {
  id_demande: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_demande: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  id_produit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_fournisseur: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantite_demandee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantite_recue: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date_livraison_souhaitee: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_livraison_reelle: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes_reception: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statut: {
    type: DataTypes.STRING,
    defaultValue: 'en attente',
    enum: ['en attente', 'en cours', 'livrée', 'annulée']
  }
}, {
  tableName: 'demandes_livraison',
  timestamps: true
});

module.exports = DemandeLivraison;
