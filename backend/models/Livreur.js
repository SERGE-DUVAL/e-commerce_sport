const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Livreur = sequelize.define('Livreur', {
  id_livreur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vehicule: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plaque_immatriculation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('disponible', 'en livraison', 'indisponible'),
    defaultValue: 'disponible'
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  derniere_mise_a_jour_gps: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'livreurs',
  timestamps: true,
  underscored: true
});

module.exports = Livreur;
