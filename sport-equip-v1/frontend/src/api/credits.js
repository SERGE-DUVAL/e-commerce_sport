import api from '../services/api';

export const creditAPI = {
  // Créer un avoir
  createCredit: (data) => api.post('/credits', data),

  // Récupérer tous les avoirs
  getAllCredits: () => api.get('/credits'),

  // Récupérer un avoir par ID
  getCreditById: (id) => api.get(`/credits/${id}`),

  // Mettre à jour un avoir
  updateCredit: (id, data) => api.put(`/credits/${id}`, data),

  // Utiliser un avoir
  useCredit: (id) => api.put(`/credits/${id}/use`),

  // Annuler un avoir
  cancelCredit: (id) => api.put(`/credits/${id}/cancel`),

  // Supprimer un avoir
  deleteCredit: (id) => api.delete(`/credits/${id}`)
};
