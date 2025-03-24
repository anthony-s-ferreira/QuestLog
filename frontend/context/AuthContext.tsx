"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { api } from "@/services/api"; // Axios configurado

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAdmin: () => boolean;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      fetchUser(); // Busca os dados do usuário autenticado
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/me"); // Endpoint para retornar o usuário autenticado
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário autenticado:", error);
      signOut();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login(email, password);
      localStorage.setItem("token", token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      await fetchUser();
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = "";
  };

  const isAdmin = () => {
    return user?.type === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAdmin, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};