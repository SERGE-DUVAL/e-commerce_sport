const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');
// const { protect } = require('../middleware/auth');

// Désactivé temporairement pour permettre le test sans connexion
router.post('/chat', chat);

module.exports = router;
