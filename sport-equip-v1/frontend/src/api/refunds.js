import api from '../services/api';

export const refundAPI = {
  // Créer une demande de remboursement/échange
  createDemande: (data) => api.post('/refunds', data),

  // Récupérer les demandes de l'utilisateur connecté
  getUserDemandes: () => api.get('/refunds/mes-demandes'),

  // Récupérer toutes les demandes (admin)
  getAllDemandes: () => api.get('/refunds/all'),

  // Approuver une demande (admin)
  approveDemande: (id, data) => api.put(`/refunds/${id}/approve`, data),

  // Refuser une demande (admin)
  rejectDemande: (id, data) => api.put(`/refunds/${id}/reject`, data),

  // Marquer une demande comme traitée (admin)
  markAsTraitee: (id) => api.put(`/refunds/${id}/traite`)
};
