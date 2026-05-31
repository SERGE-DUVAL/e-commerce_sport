const Sequelize = require('sequelize');
const path = require('path');
const Database = require('better-sqlite3');

// Compatibility wrapper for better-sqlite3 v12 with Sequelize v6
const betterSqlite3 = {
  Database: Database,
  Sqlite: Database
};

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../sport-equip.sqlite'),
  logging: false,
  dialectModule: betterSqlite3,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
