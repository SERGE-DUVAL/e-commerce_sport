const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Produit = require('./Produit');

const ZoneStockage = sequelize.define('ZoneStockage', {
  id_zone: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type_zone: {
    type: Sequelize.ENUM('surface de vente', 'mezzanine', 'entrepôt', 'réserve'),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  capacite: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  actif: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'zones_stockage',
  timestamps: true
});

ZoneStockage.belongsToMany(Produit, { through: 'ProduitZone', foreignKey: 'id_zone', as: 'produits' });
Produit.belongsToMany(ZoneStockage, { through: 'ProduitZone', foreignKey: 'id_produit', as: 'zones' });

module.exports = ZoneStockage;
