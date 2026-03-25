import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  signUp: async (name, phone, email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/signup", {
        name,
        phone,
        email,
        password,
      });
      const { user, token } = response.data;
      set({ user, token, loading: false });
      localStorage.setItem("token", token);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  },
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data;
      set({ user, token, loading: false });
      localStorage.setItem("token", token);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },
  signOut: async () => {
    set({ loading: true });
    try {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },
  setUser: (user) => set({ user, loading: false }),
  initialize: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ user: response.data, token, loading: false });
      } catch {
        localStorage.removeItem("token");
        set({ user: null, token: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },
}));
