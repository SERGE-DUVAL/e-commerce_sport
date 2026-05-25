const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  id_utilisateur: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  mot_de_passe: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('client', 'admin'),
    defaultValue: 'client'
  },
  points_fidelite: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  adresse_livraison: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'utilisateurs',
  timestamps: true
});

module.exports = Utilisateur;
