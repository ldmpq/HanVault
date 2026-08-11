import { create } from 'zustand';
import axiosClient from '../lib/axiosClient';

interface User {
  id: string | number;
  displayName?: string;
  email: string;
  avatar?: string;
  targetHskLevel: any;
  currentHskLevel: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  fetchUserProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  fetchUserProfile: async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      if (response.data && response.data.success) {
        set({ user: response.data.data || response.data.user });
      }
    } catch (error) {
      console.error('Không thể tải thông tin người dùng:', error);
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, user: null });
  },
}));