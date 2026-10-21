const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createDemande,
  getUserDemandes,
  getAllDemandes,
  approveDemande,
  rejectDemande,
  markAsTraitee
} = require('../controllers/refundController');

// Routes pour les utilisateurs connectés
router.post('/', protect, createDemande);
router.get('/mes-demandes', protect, getUserDemandes);

// Routes pour l'admin
router.get('/all', protect, getAllDemandes);
router.put('/:id/approve', protect, admin, approveDemande);
router.put('/:id/reject', protect, admin, rejectDemande);
router.put('/:id/traite', protect, admin, markAsTraitee);

module.exports = router;
