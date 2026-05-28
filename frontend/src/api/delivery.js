import api from '../services/api';

export const deliveryAPI = {
  // Créer un livreur
  createLivreur: (data) => api.post('/delivery/livreurs', data),

  // Récupérer tous les livreurs
  getAllLivreurs: () => api.get('/delivery/livreurs'),

  // Récupérer un livreur par ID
  getLivreurById: (id) => api.get(`/delivery/livreurs/${id}`),

  // Modifier un livreur
  updateLivreur: (id, data) => api.put(`/delivery/livreurs/${id}`, data),

  // Supprimer un livreur
  deleteLivreur: (id) => api.delete(`/delivery/livreurs/${id}`),

  // Affecter une commande à un livreur
  assignDelivery: (data) => api.post('/delivery/assign', data),

  // Mettre à jour la position GPS d'un livreur
  updateLivreurLocation: (id, data) => api.put(`/delivery/livreurs/${id}/location`, data),

  // Récupérer la météo pour une position GPS
  getWeather: (latitude, longitude) => api.get(`/delivery/weather?latitude=${latitude}&longitude=${longitude}`),

  // Calculer la distance entre deux points GPS
  calculateDistance: (lat1, lon1, lat2, lon2) => api.get(`/delivery/distance?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`),

  // Récupérer les affectations de livraison
  getAffectations: () => api.get('/delivery/affectations'),

  // Mettre à jour le statut d'une affectation
  updateAffectationStatus: (id, data) => api.put(`/delivery/affectations/${id}`, data),

  // Générer un bordereau de livraison en PDF
  generateDeliveryNote: (id) => {
    return {
      url: `/api/delivery/affectations/${id}/bordereau`,
      method: 'GET'
    };
  }
};
