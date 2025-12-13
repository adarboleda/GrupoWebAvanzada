'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) {
      setToken(tokenGuardado);
      verificarToken(tokenGuardado);
    } else {
      setCargando(false);
    }
  }, []);

  const verificarToken = async (tokenActual: string) => {
    try {
      const respuesta = await authService.verificarToken(tokenActual);
      if (respuesta.success) {
        setUsuario(respuesta.usuario);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setCargando(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const respuesta = await authService.login(email, password);
      if (respuesta.success) {
        localStorage.setItem('token', respuesta.token);
        setToken(respuesta.token);
        setUsuario(respuesta.usuario);
        return { success: true };
      }
      return respuesta;
    } catch (error) {
      return { success: false, error: (error as any).message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
