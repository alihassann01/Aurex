import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from Zustand store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 clear auth state and redirect to login
// No refresh token endpoint exists in backend — single-attempt only
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, expired, or blacklisted — clear state
      const store = useAuthStore.getState();
      if (store.isAuthenticated) {
        store.logout();
        // Clear cookies used by middleware
        if (typeof document !== 'undefined') {
          document.cookie = 'civic-token=; path=/; max-age=0';
          document.cookie = 'civic-role=; path=/; max-age=0';
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
