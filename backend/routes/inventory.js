const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createInventaire,
  getAllInventaires,
  getInventaireById,
  addLigneInventaire,
  updateLigneInventaire,
  finishInventaire,
  validateInventaire,
  deleteInventaire
} = require('../controllers/inventoryController');

// Routes admin pour la gestion des inventaires
router.post('/', protect, admin, createInventaire);
router.get('/', protect, admin, getAllInventaires);
router.get('/:id', protect, admin, getInventaireById);
router.post('/:id/lignes', protect, admin, addLigneInventaire);
router.put('/lignes/:id', protect, admin, updateLigneInventaire);
router.put('/:id/finish', protect, admin, finishInventaire);
router.put('/:id/validate', protect, admin, validateInventaire);
router.delete('/:id', protect, admin, deleteInventaire);

module.exports = router;
