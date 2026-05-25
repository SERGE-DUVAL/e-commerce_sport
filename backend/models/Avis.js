const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Produit = require('./Produit');
const Utilisateur = require('./Utilisateur');

const Avis = sequelize.define('Avis', {
  id_avis: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  commentaire: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'avis',
  timestamps: true
});

Avis.belongsTo(Produit, { foreignKey: 'id_produit' });
Produit.hasMany(Avis, { foreignKey: 'id_produit' });

Avis.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });
Utilisateur.hasMany(Avis, { foreignKey: 'id_utilisateur' });

module.exports = Avis;
