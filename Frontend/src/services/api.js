import axios from 'axios'

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Products APIs
export const productAPI = {
  getAllProducts: (params) => api.get('/product', { params }),
  getProductById: (id) => api.get(`/product/${id}`),
  createProduct: (data) => api.post('/product', data),
  updateProduct: (id, data) => api.put(`/product/${id}`, data),
  deleteProduct: (id) => api.delete(`/product/${id}`),
  rateProduct: (productId, data) => api.put(`/product/rating/${productId}`, data),
}

// Orders APIs
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/find/${userId}`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  getAllOrders: () => api.get('/orders'),
}

// Payment APIs
export const paymentAPI = {
  getPaymentConfig: () => api.get('/payment/config'),
  createPaymentOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getPaymentStatus: (paymentId) => api.get(`/payment/status/${paymentId}`),
}

// Users APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/find/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

// Skin analysis & reports
export const skinReportAPI = {
  analyze: (formData) =>
    api.post('/skin/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  createReport: (formData) =>
    api.post('/skin/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyReports: () => api.get('/skin/reports/my'),
  getReportById: (id) => api.get(`/skin/reports/${id}`),
  getAllForDerm: (params) => api.get('/skin/reports/derm/all', { params }),
  reviewReport: (id, data) => api.put(`/skin/reports/${id}/review`, data),
}

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
}

// Banners APIs
export const bannerAPI = {
  getAllBanners: () => api.get('/banners'),
  getRandomBanner: () => api.get('/banners/random'),
  createBanner: (data) => api.post('/banners', data),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
}

export default api
