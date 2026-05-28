import api from '../services/api';

export const cashAPI = {
  // Créer une caisse
  createCash: (data) => api.post('/cash', data),

  // Récupérer toutes les caisses
  getAllCash: () => api.get('/cash'),

  // Récupérer une caisse par ID
  getCashById: (id) => api.get(`/cash/${id}`),

  // Modifier une caisse
  updateCash: (id, data) => api.put(`/cash/${id}`, data),

  // Fermer une caisse
  closeCash: (id) => api.put(`/cash/${id}/close`),

  // Ouvrir une caisse
  openCash: (id) => api.put(`/cash/${id}/open`),

  // Mettre à jour le solde d'une caisse
  updateSolde: (id, data) => api.put(`/cash/${id}/solde`, data),

  // Supprimer une caisse
  deleteCash: (id) => api.delete(`/cash/${id}`)
};
