const express = require('express');
const router = express.Router();
const { initiateSwitchPayment, switchWebhook } = require('../controllers/paymentController');

router.post('/switch', initiateSwitchPayment);
router.post('/webhook', switchWebhook);

module.exports = router;
