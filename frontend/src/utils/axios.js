// utils/axios.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  // Backend base URL — now includes /api so you can just call api.get('/auth/login')
  baseURL: process.env.REACT_APP_API_URL || 'http://13.234.168.116:5000/api',
  withCredentials: true, // needed for cookie/session-based auth
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10s timeout to avoid hanging requests
});

// ----- Request Interceptor -----
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Unable to read token from localStorage:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor -----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else {
        console.error('Network/CORS error or no response:', error.message);
      }
    }

    // Handle 401 Unauthorized globally (optional)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized — clearing token and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

