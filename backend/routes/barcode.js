const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  generateEAN13,
  generateQRCode,
  createCodeBarre,
  getAllCodesBarres,
  getCodesByProduit,
  scanCodeBarre,
  toggleCodeBarre,
  deleteCodeBarre
} = require('../controllers/barcodeController');

// Routes publiques pour le scan
router.post('/scan', scanCodeBarre);

// Routes admin pour la gestion des codes-barres
router.post('/generate/ean13', protect, admin, generateEAN13);
router.post('/generate/qrcode', protect, admin, generateQRCode);
router.post('/', protect, admin, createCodeBarre);
router.get('/', protect, admin, getAllCodesBarres);
router.get('/produit/:id_produit', protect, admin, getCodesByProduit);
router.put('/:id/toggle', protect, admin, toggleCodeBarre);
router.delete('/:id', protect, admin, deleteCodeBarre);

module.exports = router;
