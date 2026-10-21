const { Sequelize } = require('sequelize');
const path = require('path');

const commonOptions = {
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...commonOptions,
    dialect: 'postgres',
    dialectOptions: process.env.DATABASE_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: true } }
      : {}
  });
} else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL est obligatoire en production.');
  }

  sequelize = new Sequelize({
    ...commonOptions,
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || path.join(__dirname, '../../database/sport-equip.sqlite')
  });
}

module.exports = sequelize;
