const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../sport-equip.sqlite'),
  logging: false,
  dialectModule: require('better-sqlite3'),
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
