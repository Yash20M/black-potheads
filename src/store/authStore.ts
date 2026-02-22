import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
  token?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  setUser: (user: User, token: string) => void;
  setAdmin: (token: string) => void;
  logout: () => void;
  logoutAdmin: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,

      setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({ user: { ...user, token }, token, isAdmin: false });
      },

      setAdmin: (token) => {
        localStorage.setItem('admin_token', token);
        set({ isAdmin: true, token });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAdmin: false });
      },

      logoutAdmin: () => {
        localStorage.removeItem('admin_token');
        set({ isAdmin: false, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
