const express = require('express');
const router = express.Router();
const cinetPayController = require('../controllers/cinetPayController');

// Créer une session de paiement Cinet Pay
router.post('/create-session', cinetPayController.createPaymentSession);

// Vérifier le statut d'une transaction Cinet Pay
router.get('/status/:transactionId', cinetPayController.checkPaymentStatus);

// Webhook Cinet Pay
router.post('/webhook', cinetPayController.webhook);

module.exports = router;
