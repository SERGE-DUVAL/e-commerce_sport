import api from '../services/api';

export const barcodeAPI = {
  // Générer un code-barres EAN13
  generateEAN13: (data) => api.post('/barcode/generate/ean13', data),

  // Générer un QR code
  generateQRCode: (data) => api.post('/barcode/generate/qrcode', data),

  // Créer un code-barres pour un produit
  createCodeBarre: (data) => api.post('/barcode', data),

  // Récupérer tous les codes-barres
  getAllCodesBarres: () => api.get('/barcode'),

  // Récupérer les codes-barres d'un produit
  getCodesByProduit: (id_produit) => api.get(`/barcode/produit/${id_produit}`),

  // Scanner un code-barres
  scanCodeBarre: (data) => api.post('/barcode/scan', data),

  // Activer/Désactiver un code-barres
  toggleCodeBarre: (id) => api.put(`/barcode/${id}/toggle`),

  // Supprimer un code-barres
  deleteCodeBarre: (id) => api.delete(`/barcode/${id}`)
};
