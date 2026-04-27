import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '@/services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });
      },
      register: async (formData) => {
        const { data } = await API.post('/auth/register', formData);
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });
      },
      logout: async () => {
        try {
          await API.post('/auth/logout');
        } catch (error) {
          console.error('Logout failed:', error);
        }
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
