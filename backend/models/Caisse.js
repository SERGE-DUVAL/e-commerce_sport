const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');

const Caisse = sequelize.define('Caisse', {
  id_caisse: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  solde_initial: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  solde_actuel: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  date_ouverture: {
    type: Sequelize.DATE,
    allowNull: false
  },
  date_fermeture: {
    type: Sequelize.DATE
  },
  statut: {
    type: Sequelize.ENUM('ouverte', 'fermée', 'en maintenance'),
    defaultValue: 'ouverte'
  },
  responsable_actuel: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'caisses',
  timestamps: true
});

Caisse.belongsTo(Utilisateur, { foreignKey: 'id_responsable', as: 'responsable' });
Utilisateur.hasMany(Caisse, { foreignKey: 'id_responsable', as: 'caisses' });

module.exports = Caisse;
