import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/refresh', {
          withCredentials: true,
        });

        const newToken = data.accessToken;
        const user = useAuthStore.getState().user;

        if (user) {
          useAuthStore.getState().setAuth(user, newToken);
        }

        // IMPORTANT: Update the header and baseURL for the retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // If the original request used a relative URL, axios(originalRequest) might fail 
        // if not called from the instance. So we use API(originalRequest).
        return API(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
