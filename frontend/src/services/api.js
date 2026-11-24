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
  withCredentials: true, // Ensures cookies pass correctly
  xsrfCookieName: 'csrf_token',
  xsrfHeaderName: 'X-CSRF-Token',
});

// Cache for CSRF Token in memory
let cachedCsrfToken = null;
let csrfFetchPromise = null;

export const fetchCsrfToken = async () => {
  if (cachedCsrfToken) return cachedCsrfToken;
  if (csrfFetchPromise) return csrfFetchPromise;

  csrfFetchPromise = axios
    .get(`${getBaseURL()}/auth/csrf`, { withCredentials: true })
    .then((res) => {
      if (res.data?.csrfToken) {
        cachedCsrfToken = res.data.csrfToken;
        return cachedCsrfToken;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      csrfFetchPromise = null;
    });

  return csrfFetchPromise;
};

// Eagerly prefetch CSRF token on startup
if (typeof window !== 'undefined') {
  fetchCsrfToken();
}

// Request interceptor: attach Authorization Bearer token & X-CSRF-Token
API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('aviation_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      if (!config.headers['X-CSRF-Token']) {
        const csrf = cachedCsrfToken || (await fetchCsrfToken());
        if (csrf) {
          config.headers['X-CSRF-Token'] = csrf;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-retry once on CSRF_INVALID, and handle 401s
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Transparently auto-retry once on CSRF_INVALID with a fresh token
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.code === 'CSRF_INVALID' &&
      originalRequest &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      cachedCsrfToken = null;
      const freshCsrf = await fetchCsrfToken();
      if (freshCsrf) {
        originalRequest.headers['X-CSRF-Token'] = freshCsrf;
        return API(originalRequest);
      }
    }

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
