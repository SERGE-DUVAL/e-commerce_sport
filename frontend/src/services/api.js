import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  assignToZone: (data) => api.post('/products/assign-zone', data),
  getZones: (id) => api.get(`/products/${id}/zones`),
  removeFromZone: (data) => api.post('/products/remove-zone', data)
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  processPayment: (data) => api.post('/orders/payment', data),
  generateCashReceipt: (id) => {
    return {
      url: `/api/orders/${id}/ticket`,
      method: 'GET'
    };
  },
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  confirmReception: (id) => api.put(`/orders/${id}/confirm-reception`),
  requestRefund: (id, data) => api.post(`/orders/${id}/refund`, data)
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getDeliveryReviews: () => api.get('/reviews/delivery')
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getPoints: () => api.get('/users/points')
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllClients: () => api.get('/admin/clients'),
  deleteClient: (id) => api.delete(`/admin/clients/${id}`),
  getUserOrders: (id) => api.get(`/admin/clients/${id}/orders`),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  createPromotion: (data) => api.post('/admin/promotions', data),
  getAllPromotions: () => api.get('/admin/promotions'),
  updatePromotion: (id, data) => api.put(`/admin/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/admin/promotions/${id}`),
  exportPDF: () => api.get('/admin/export/pdf', { responseType: 'blob' }),
  exportCSV: () => api.get('/admin/export/csv', { responseType: 'blob' })
};

export const chatbotAPI = {
  chat: (data) => api.post('/chatbot/chat', data)
};

export const promotionAPI = {
  validate: (data) => api.post('/promotions/validate', data)
};

export const paymentAPI = {
  initiateSwitch: (data) => api.post('/payment/switch', data)
};

export const stockAPI = {
  createMouvement: (data) => api.post('/stock/mouvements', data),
  getMouvements: (params) => api.get('/stock/mouvements', { params }),
  getStockAlerts: () => api.get('/stock/alerts'),
  getStockForecast: () => api.get('/stock/forecast')
};

export default api;


