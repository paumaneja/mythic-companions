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
  try {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('authUser');

    if (token && userJson && userJson !== 'undefined') {
      const user = JSON.parse(userJson) as UserDto;
      return { token, user, isAuthenticated: true };
    }
  } catch (error) {
    console.error("Failed to parse auth user from localStorage", error);
    return { token: null, user: null, isAuthenticated: false };
  }

  return { token: null, user: null, isAuthenticated: false };
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