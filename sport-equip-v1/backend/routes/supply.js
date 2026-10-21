const express = require('express');
const router = express.Router();
const { 
  createDemandeLivraison, 
  getAllDemandesLivraison, 
  getProduitsEnRupture,
  updateDemandeLivraison,
  deleteDemandeLivraison
} = require('../controllers/supplyController');
const { protect, admin } = require('../middleware/auth');

router.post('/demandes', protect, admin, createDemandeLivraison);
router.get('/demandes', protect, admin, getAllDemandesLivraison);
router.get('/produits-rupture', protect, admin, getProduitsEnRupture);
router.put('/demandes/:id', protect, admin, updateDemandeLivraison);
router.delete('/demandes/:id', protect, admin, deleteDemandeLivraison);

module.exports = router;
