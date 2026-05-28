const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Produit = require('./Produit');

const CodeBarre = sequelize.define('CodeBarre', {
  id_code: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code_barre: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  type_code: {
    type: Sequelize.ENUM('EAN13', 'EAN8', 'UPC', 'QR'),
    allowNull: false,
    defaultValue: 'EAN13'
  },
  qr_code_data: {
    type: Sequelize.TEXT
  },
  actif: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  date_generation: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  date_scan: {
    type: Sequelize.DATE
  },
  nombre_scans: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'codes_barres',
  timestamps: true
});

CodeBarre.belongsTo(Produit, { foreignKey: 'id_produit', as: 'produit' });
Produit.hasMany(CodeBarre, { foreignKey: 'id_produit', as: 'codesBarres' });

module.exports = CodeBarre;
