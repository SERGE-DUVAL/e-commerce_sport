const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const LigneInventaire = sequelize.define('LigneInventaire', {
  id_ligne: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_inventaire: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_produit: {
    type: Sequelize.INTEGER,
    allowNull: false
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

// Les associations sont définies dans les fichiers des modèles principaux (Inventaire.js et Produit.js)
// pour éviter les imports circulaires

module.exports = LigneInventaire;
