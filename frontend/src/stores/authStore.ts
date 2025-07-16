import { create } from 'zustand';
import type { UserDto } from '../types';

interface AuthState {
  token: string | null;
  user: UserDto | null;
  isAuthenticated: boolean;
  setToken: (token: string, user: UserDto) => void;
  logout: () => void;
}

const getInitialState = () => {
  const token = localStorage.getItem('authToken');
  const userJson = localStorage.getItem('authUser');
  const user = userJson ? (JSON.parse(userJson) as UserDto) : null;

  return { token, user, isAuthenticated: !!token };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setToken: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));