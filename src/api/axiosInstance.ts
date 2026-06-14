import axios from 'axios';
import { API_BASE_URL } from './config';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle 401 Unauthorized globally here if needed
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    // Properly format error for better error handling downstream
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      // Ensure error has a proper message property
      if (errorData.message && !error.message) {
        error.message = errorData.message;
      }
    }

    return Promise.reject(error);
  }
);
