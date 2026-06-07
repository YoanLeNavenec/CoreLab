import { create } from "zustand";
import { loginUser, logoutUser, getMe } from "../api/auth.api";

// Zustand store for authentication state management
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  //called on app startup to restore session
  init: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return set({ loading: false });

      const user = await getMe();
      set({ user, accessToken: token, loading: false });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null, loading: false });
    }
  },

//Login function that calls the API, stores the token, and updates the state
  login: async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("accessToken", data.accessToken);
    set({ user: data.user, accessToken: data.accessToken });
  },

//Logout function that calls the API, clears the token, and resets the state
  logout: async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },
}));