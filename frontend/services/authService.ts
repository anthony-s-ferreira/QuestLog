import { api, setAuthToken } from "@/services/api";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/login", { email, password });
    const { token } = response.data;

    localStorage.setItem('token', token);
    setAuthToken(token); 

    return response.data;
  },

  async logout() {
    await api.post("/user/logout");
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post("/register", { name, email, password });
    const { token } = response.data;

    localStorage.setItem('token', token);
    setAuthToken(token); 

    return response.data;
  },
  
};
