import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injeta token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redireciona para login se o token expirar
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

// ── Auth ──────────────────────────────────────────────────────
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  me: () =>
    api.get('/auth/me'),
  logout: () =>
    api.post('/auth/logout'),
};

// ── Posts ─────────────────────────────────────────────────────
export const postsService = {
  getAll: (params) =>
    api.get('/posts', { params }),
  getById: (id) =>
    api.get(`/posts/${id}`),
  create: (data) =>
    api.post('/posts', data),
  update: (id, data) =>
    api.put(`/posts/${id}`, data),
  delete: (id) =>
    api.delete(`/posts/${id}`),
};

export default api;
