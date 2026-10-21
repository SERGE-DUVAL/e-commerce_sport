const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id_promotion: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  pourcentage_remise: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  est_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  date_expiration: {
    type: Sequelize.DATE
  }
}, {
  tableName: 'promotions',
  timestamps: true
});

module.exports = Promotion;
