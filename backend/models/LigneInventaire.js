const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Inventaire = require('./Inventaire');
const Produit = require('./Produit');

const LigneInventaire = sequelize.define('LigneInventaire', {
  id_ligne: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantite_theorique: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  quantite_physique: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ecart: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  methode_comptage: {
    type: Sequelize.ENUM('manuel', 'électronique', 'mixte'),
    defaultValue: 'manuel'
  },
  notes: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'lignes_inventaires',
  timestamps: true
});

LigneInventaire.belongsTo(Inventaire, { foreignKey: 'id_inventaire', as: 'inventaire' });
Inventaire.hasMany(LigneInventaire, { foreignKey: 'id_inventaire', as: 'lignes' });

LigneInventaire.belongsTo(Produit, { foreignKey: 'id_produit', as: 'produit' });
Produit.hasMany(LigneInventaire, { foreignKey: 'id_produit', as: 'lignesInventaires' });

module.exports = LigneInventaire;
