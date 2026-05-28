const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produit = require('./Produit');
const Utilisateur = require('./Utilisateur');

const MouvementStock = sequelize.define('MouvementStock', {
  id_mouvement: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_produit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produit,
      key: 'id_produit'
    }
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Utilisateur,
      key: 'id_utilisateur'
    }
  },
  type_mouvement: {
    type: DataTypes.ENUM('entree', 'sortie', 'ajustement'),
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_avant: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_apres: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motif: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'mouvements_stock',
  timestamps: true,
  underscored: true
});

MouvementStock.belongsTo(Produit, { foreignKey: 'id_produit', as: 'produit' });
MouvementStock.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = MouvementStock;
