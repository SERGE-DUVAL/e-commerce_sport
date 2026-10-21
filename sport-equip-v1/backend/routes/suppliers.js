const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createFournisseur,
  getAllFournisseurs,
  getFournisseurById,
  updateFournisseur,
  toggleFournisseur,
  deleteFournisseur
} = require('../controllers/supplierController');

// Routes admin pour la gestion des fournisseurs
router.post('/', protect, admin, createFournisseur);
router.get('/', protect, admin, getAllFournisseurs);
router.get('/:id', protect, admin, getFournisseurById);
router.put('/:id', protect, admin, updateFournisseur);
router.put('/:id/toggle', protect, admin, toggleFournisseur);
router.delete('/:id', protect, admin, deleteFournisseur);

module.exports = router;
