const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Commande = require('./Commande');
const Produit = require('./Produit');

const LigneCommande = sequelize.define('LigneCommande', {
  id_ligne: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  prix_unitaire_achat: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  taille_selectionnee: {
    type: Sequelize.STRING
  },
  couleur_selectionnee: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'lignes_commandes',
  timestamps: true
});

LigneCommande.belongsTo(Commande, { foreignKey: 'id_commande', as: 'commande' });
Commande.hasMany(LigneCommande, { foreignKey: 'id_commande', as: 'LigneCommandes' });

LigneCommande.belongsTo(Produit, { foreignKey: 'id_produit', as: 'Produit' });
Produit.hasMany(LigneCommande, { foreignKey: 'id_produit', as: 'LigneCommandes' });

module.exports = LigneCommande;
