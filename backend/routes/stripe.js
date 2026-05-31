const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Créer une session de paiement Stripe
router.post('/create-session', stripeController.createPaymentSession);

// Vérifier le statut d'une session de paiement
router.get('/status/:sessionId', stripeController.checkPaymentStatus);

// Webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.webhook);

module.exports = router;
