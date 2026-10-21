import api from '../services/api';

export const inventoryAPI = {
  // Créer un inventaire
  createInventory: (data) => api.post('/inventory', data),

  // Récupérer tous les inventaires
  getAllInventories: () => api.get('/inventory'),

  // Récupérer un inventaire par ID
  getInventoryById: (id) => api.get(`/inventory/${id}`),

  // Récupérer les lignes d'un inventaire
  getInventoryLines: (id) => api.get(`/inventory/${id}/lignes`),

  // Ajouter une ligne à un inventaire
  addInventoryLine: (id, data) => api.post(`/inventory/${id}/lignes`, data),

  // Mettre à jour une ligne d'inventaire
  updateInventoryLine: (id, data) => api.put(`/inventory/lignes/${id}`, data),

  // Terminer un inventaire
  finishInventory: (id) => api.put(`/inventory/${id}/finish`),

  // Valider un inventaire
  validateInventory: (id) => api.put(`/inventory/${id}/validate`),

  // Supprimer un inventaire
  deleteInventory: (id) => api.delete(`/inventory/${id}`)
};
