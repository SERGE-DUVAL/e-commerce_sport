const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/sport-equip.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  },
  dialectOptions: {
    // Désactiver les contraintes de clé étrangère pour SQLite
    mode: Sequelize.OPEN_READWRITE | Sequelize.OPEN_CREATE
  }
});

// Désactiver les contraintes de clé étrangère pour SQLite
sequelize.query('PRAGMA foreign_keys = OFF');

module.exports = sequelize;
