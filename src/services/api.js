import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена к запросам
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

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  checkUsername: (username) => api.get(`/auth/check-username/${username}`),
  checkEmail: (email) => api.get(`/auth/check-email/${email}`),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Declaration API
export const declarationAPI = {
  getAll: () => api.get('/declarations'),
  getById: (id) => api.get(`/declarations/${id}`),
  getByClient: (clientId) => api.get(`/declarations/client/${clientId}`),
  create: (declarationData) => api.post('/declarations', declarationData),
  update: (id, declarationData) => api.put(`/declarations/${id}`, declarationData),
  delete: (id) => api.delete(`/declarations/${id}`),
  updateStatus: (id, status) => api.patch(`/declarations/${id}/status`, { status }),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByClient: (clientId) => api.get(`/payments/client/${clientId}`),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
  process: (id) => api.post(`/payments/${id}/process`),
};

// Activity API
export const activityAPI = {
  getAll: () => api.get('/activities'),
  getByUser: (userId) => api.get(`/activities/user/${userId}`),
  getRecentByUser: (userId, limit = 10) =>
    api.get(`/activities/user/${userId}/recent?limit=${limit}`),
  create: (activityData) => api.post('/activities', activityData),
  createForUser: (username, description) =>
    api.post(`/activities/user/${username}`, { description }),
};

// Vehicle API
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  getById: (id) => api.get(`/vehicles/${id}`),
  getAvailable: () => api.get('/vehicles/available'),
  getRentedByDriver: (driverId) => api.get(`/vehicles/driver/${driverId}/rented`),
  getAllRented: () => api.get('/vehicles/rented'),
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicles/${id}`),
  rent: (vehicleId, days) =>
    api.post(`/vehicles/${vehicleId}/rent`, { days }),
  return: (vehicleId) =>
    api.post(`/vehicles/${vehicleId}/return`),
};

export default api;

