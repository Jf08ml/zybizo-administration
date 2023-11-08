import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("accessToken") || null,
    refreshTokenUser: localStorage.getItem("refreshToken") || null,
    userRole: localStorage.getItem("userRole") || "", 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setCredentials(token, refreshToken, role) {
      this.token = token;
      this.refreshTokenUser = refreshToken;
      this.userRole = role; // Establecer el rol del usuario

      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", role); // Guardar el rol en localStorage
    },
    logout() {
      this.token = null;
      this.refreshTokenUser = null;
      this.userRole = ""; // Limpiar el rol del usuario

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole"); // Remover el rol del localStorage
    },
  },
});
