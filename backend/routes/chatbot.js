const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');
// const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/chatbot/chat:
 *   post:
 *     summary: Chat with AI assistant
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's message to the chatbot
 *     responses:
 *       200:
 *         description: Chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 *                   description: Chatbot's response message
 *       500:
 *         description: Server error or AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
// Désactivé temporairement pour permettre le test sans connexion
router.post('/chat', chat);

module.exports = router;
