const express = require('express');
const router = express.Router();
const { 
  createMouvement, 
  getMouvements, 
  getStockAlerts, 
  getStockForecast 
} = require('../controllers/stockController');
const { protect, admin } = require('../middleware/auth');

router.post('/mouvements', protect, admin, createMouvement);
router.get('/mouvements', protect, admin, getMouvements);
router.get('/alerts', protect, admin, getStockAlerts);
router.get('/forecast', protect, admin, getStockForecast);

module.exports = router;
