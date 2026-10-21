const express = require('express');
const router = express.Router();
const { updateProfile, getUserPoints } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/points', protect, getUserPoints);

module.exports = router;
