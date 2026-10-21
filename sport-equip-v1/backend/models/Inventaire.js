const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const LigneInventaire = require('./LigneInventaire');

const Inventaire = sequelize.define('Inventaire', {
  id_inventaire: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_inventaire: {
    type: Sequelize.ENUM('général', 'partiel', 'zone'),
    allowNull: false,
    defaultValue: 'partiel'
  },
  zone: {
    type: Sequelize.STRING
  },
  date_debut: {
    type: Sequelize.DATE,
    allowNull: false
  },
  date_fin: {
    type: Sequelize.DATE
  },
  statut: {
    type: Sequelize.ENUM('en cours', 'terminé', 'validé', 'annulé'),
    defaultValue: 'en cours'
  },
  responsable: {
    type: Sequelize.STRING
  },
  notes: {
    type: Sequelize.TEXT
  },
  total_theorique: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  total_physique: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  ecart: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  taux_correspondance: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'inventaires',
  timestamps: true
});

Inventaire.belongsTo(Utilisateur, { foreignKey: 'id_responsable', as: 'responsable_user' });
Utilisateur.hasMany(Inventaire, { foreignKey: 'id_responsable', as: 'inventaires' });

Inventaire.hasMany(LigneInventaire, { foreignKey: 'id_inventaire', as: 'lignes' });
LigneInventaire.belongsTo(Inventaire, { foreignKey: 'id_inventaire', as: 'inventaire' });

module.exports = Inventaire;
