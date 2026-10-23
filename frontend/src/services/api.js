import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Ensures HTTP-only cookies pass correctly
});

// Attach Authorization Bearer token from localStorage if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aviation_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s to clear stale local auth data if expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear on login attempt failures
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('aviation_auth_token');
        localStorage.removeItem('aviation_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
