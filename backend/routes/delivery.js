const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createLivreur,
  getAllLivreurs,
  getLivreurById,
  updateLivreur,
  deleteLivreur,
  assignDelivery,
  updateLivreurLocation,
  getWeather,
  calculateDistance,
  getAffectations,
  updateAffectationStatus,
  generateDeliveryNote
} = require('../controllers/deliveryController');

// Routes livreurs (admin uniquement)
router.post('/livreurs', protect, admin, createLivreur);
router.get('/livreurs', getAllLivreurs);
router.get('/livreurs/:id', protect, admin, getLivreurById);
router.put('/livreurs/:id', protect, admin, updateLivreur);
router.delete('/livreurs/:id', protect, admin, deleteLivreur);
router.put('/livreurs/:id/location', protect, updateLivreurLocation);

// Routes affectations (admin uniquement)
router.post('/assign', protect, admin, assignDelivery);
router.get('/affectations', protect, getAffectations);
router.put('/affectations/:id', protect, admin, updateAffectationStatus);
router.get('/affectations/:id/bordereau', protect, generateDeliveryNote);

// Routes GPS et météo (accessibles publiquement pour la page d'accueil)
router.get('/weather', getWeather);
router.get('/distance', protect, calculateDistance);

module.exports = router;
