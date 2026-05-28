import api from '../services/api';

export const zoneAPI = {
  // Créer une zone
  createZone: (data) => api.post('/zones', data),

  // Récupérer toutes les zones
  getAllZones: () => api.get('/zones'),

  // Récupérer une zone par ID
  getZoneById: (id) => api.get(`/zones/${id}`),

  // Modifier une zone
  updateZone: (id, data) => api.put(`/zones/${id}`, data),

  // Activer/Désactiver une zone
  toggleZone: (id) => api.put(`/zones/${id}/toggle`),

  // Supprimer une zone
  deleteZone: (id) => api.delete(`/zones/${id}`),

  // Ajouter un produit à une zone
  addProductToZone: (id, data) => api.post(`/zones/${id}/products`, data),

  // Retirer un produit d'une zone
  removeProductFromZone: (id, data) => api.delete(`/zones/${id}/products`, { data })
};
