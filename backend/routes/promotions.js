const express = require('express');
const router = express.Router();
const { validatePromotion } = require('../controllers/promotionController');
const { protect } = require('../middleware/auth');

router.post('/validate', protect, validatePromotion);

module.exports = router;
