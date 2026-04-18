import axios from 'axios';

/**
 * Central Axios instance — every service file imports from here.
 * Change the baseURL to point at your FastAPI backend.
 */
const API = axios.create({
  baseURL: 'https://smart-ward.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- Request interceptor ----------
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ---------- Response interceptor ----------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

export default API;
