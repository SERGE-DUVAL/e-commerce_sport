const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const LigneInventaire = require('./LigneInventaire');

const Produit = sequelize.define('Produit', {
  id_produit: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  categorie: {
    type: Sequelize.ENUM('Football', 'Running', 'Fitness', 'Tennis', 'Basketball'),
    allowNull: false
  },
  prix_xaf: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  stock: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  variantes: {
    type: Sequelize.TEXT,
    get() {
      const rawValue = this.getDataValue('variantes');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('variantes', JSON.stringify(value));
    }
  }
}, {
  tableName: 'produits',
  timestamps: true
});

Produit.hasMany(LigneInventaire, { foreignKey: 'id_produit', as: 'lignesInventaires' });
LigneInventaire.belongsTo(Produit, { foreignKey: 'id_produit', as: 'produit' });

module.exports = Produit;
