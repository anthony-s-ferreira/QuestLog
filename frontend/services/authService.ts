import { api } from "@/services/api";
import Cookies from 'js-cookie';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  async logout() {
    await api.post("/user/logout");
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post("/register", { name, email, password });
    const { token } = response.data;

    return response.data;
  },
  
};
