import api from '../services/api';

export const supplierAPI = {
  // Créer un fournisseur
  createSupplier: (data) => api.post('/suppliers', data),

  // Récupérer tous les fournisseurs
  getAllSuppliers: () => api.get('/suppliers'),

  // Récupérer un fournisseur par ID
  getSupplierById: (id) => api.get(`/suppliers/${id}`),

  // Modifier un fournisseur
  updateSupplier: (id, data) => api.put(`/suppliers/${id}`, data),

  // Activer/Désactiver un fournisseur
  toggleSupplier: (id) => api.put(`/suppliers/${id}/toggle`),

  // Supprimer un fournisseur
  deleteSupplier: (id) => api.delete(`/suppliers/${id}`)
};
