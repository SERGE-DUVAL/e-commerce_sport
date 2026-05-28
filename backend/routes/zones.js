const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  toggleZone,
  deleteZone,
  addProductToZone,
  removeProductFromZone
} = require('../controllers/zoneController');

// Routes admin pour la gestion des zones
router.post('/', protect, admin, createZone);
router.get('/', protect, admin, getAllZones);
router.get('/:id', protect, admin, getZoneById);
router.put('/:id', protect, admin, updateZone);
router.put('/:id/toggle', protect, admin, toggleZone);
router.delete('/:id', protect, admin, deleteZone);
router.post('/:id/products', protect, admin, addProductToZone);
router.delete('/:id/products', protect, admin, removeProductFromZone);

module.exports = router;
