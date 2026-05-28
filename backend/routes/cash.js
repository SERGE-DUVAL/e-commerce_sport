const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createCaisse,
  getAllCaisses,
  getCaisseById,
  updateCaisse,
  closeCaisse,
  openCaisse,
  updateSolde,
  deleteCaisse
} = require('../controllers/cashController');

// Routes admin pour la gestion des caisses
router.post('/', protect, admin, createCaisse);
router.get('/', protect, admin, getAllCaisses);
router.get('/:id', protect, admin, getCaisseById);
router.put('/:id', protect, admin, updateCaisse);
router.put('/:id/close', protect, admin, closeCaisse);
router.put('/:id/open', protect, admin, openCaisse);
router.put('/:id/solde', protect, admin, updateSolde);
router.delete('/:id', protect, admin, deleteCaisse);

module.exports = router;
