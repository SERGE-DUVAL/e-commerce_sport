const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createAvoir,
  getAllAvoirs,
  getAvoirById,
  useAvoir,
  cancelAvoir,
  deleteAvoir
} = require('../controllers/creditController');

// Routes admin pour la gestion des avoirs
router.post('/', protect, admin, createAvoir);
router.get('/', protect, admin, getAllAvoirs);
router.get('/:id', protect, admin, getAvoirById);
router.put('/:id/use', protect, admin, useAvoir);
router.put('/:id/cancel', protect, admin, cancelAvoir);
router.delete('/:id', protect, admin, deleteAvoir);

module.exports = router;
