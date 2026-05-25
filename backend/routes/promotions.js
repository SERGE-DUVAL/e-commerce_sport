const express = require('express');
const router = express.Router();
const { validatePromotion } = require('../controllers/promotionController');
const { protect, admin } = require('../middleware/auth');

router.post('/validate', protect, admin, validatePromotion);

module.exports = router;
