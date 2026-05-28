const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  assignProductToZone,
  getProductZones,
  removeProductFromZone
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/assign-zone', protect, admin, assignProductToZone);
router.get('/:id/zones', protect, admin, getProductZones);
router.post('/remove-zone', protect, admin, removeProductFromZone);

module.exports = router;
