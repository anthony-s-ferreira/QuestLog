import { api } from "@/services/api";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  async logout() {
    await api.post("/user/logout");
  },
};
