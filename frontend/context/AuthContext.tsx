"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import {api} from "@/services/api"; // Axios configurado
import Cookies from "js-cookie"
import { jwtDecode } from 'jwt-decode'


interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

interface JwtPayload {
  id: string
  name: string
  email: string
  type: string
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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        fetchUser();
        api.defaults.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        signOut();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  


  const fetchUser = async () => {
    try {
      const response = await api.get("/user/me"); // Endpoint para retornar o usuário autenticado
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuário autenticado:", error);
      signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {

      const { token, user } = await authService.login(email, password);
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict"
      })
      await fetchUser();
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const signOut = () => {
    setUser(null);
    Cookies.remove("authToken")
    api.defaults.headers.Authorization = "";
    router.push("/login");
  };
  
  const isAdmin = () => {
    return user?.type === "admin";
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAdmin, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
