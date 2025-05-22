import axios from "axios";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  username: string;
  lastLogin: Date;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;

  verifyEmail: (code: string) => Promise<void>;

  checkAuth: () => Promise<void>;
}

const API_URL =
  "https://advanced-auth-system-js-production.up.railway.app/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        email,
        password,
        username,
      });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      let errorMessage = "Error Register";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
        set({ error: errorMessage, isLoading: false });
      }

      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/verify-email`, { code });
      console.log(data);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      let errorMessage = "Error Verify Email";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
        set({ error: errorMessage, isLoading: false });
      }
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/check-auth`);
      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (err) {
      let errorMessage = "Error check auth";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
        set({
          error: errorMessage,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
      set({
        error: errorMessage,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      throw err;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      let errorMessage = "Error Login";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
        set({ error: errorMessage, isLoading: false });
      }
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },
}));
