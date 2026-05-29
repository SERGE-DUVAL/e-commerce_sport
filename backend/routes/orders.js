const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  processPayment,
  generateCashReceipt,
  cancelOrder,
  requestRefund,
  confirmReception
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.post('/payment', protect, processPayment);
router.get('/:id/ticket', protect, generateCashReceipt);
router.put('/:id/cancel', protect, cancelOrder);
router.post('/:id/refund', protect, requestRefund);
router.put('/:id/confirm-reception', protect, confirmReception);

module.exports = router;
