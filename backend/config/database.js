const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || path.join(__dirname, '../data/sport-equip.sqlite'),
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
