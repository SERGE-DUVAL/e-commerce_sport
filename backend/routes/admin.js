const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllClients,
  deleteClient,
  getUserOrders,
  getAllOrders, 
  updateOrderStatus,
  createPromotion,
  getAllPromotions,
  updatePromotion,
  deletePromotion,
  exportPDF,
  exportCSV
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/clients', protect, admin, getAllClients);
router.delete('/clients/:id', protect, admin, deleteClient);
router.get('/clients/:id/orders', protect, admin, getUserOrders);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.post('/promotions', protect, admin, createPromotion);
router.get('/promotions', protect, admin, getAllPromotions);
router.put('/promotions/:id', protect, admin, updatePromotion);
router.delete('/promotions/:id', protect, admin, deletePromotion);
router.get('/export/pdf', protect, admin, exportPDF);
router.get('/export/csv', protect, admin, exportCSV);

module.exports = router;


