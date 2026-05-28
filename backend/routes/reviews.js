const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getDeliveryReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/product/:id', getProductReviews);
router.get('/delivery', protect, admin, getDeliveryReviews);

module.exports = router;
