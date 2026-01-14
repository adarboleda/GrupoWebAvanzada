'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';

interface Usuario {
    id_usuario: number;
    username: string;
    nombre_completo: string;
    email: string;
    rol: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    cargando: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<any>;
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
            verificarToken();
        } else {
            setCargando(false);
        }
    }, []);

    const verificarToken = async () => {
        try {
            const respuesta = await authService.verificarToken();
            if (respuesta.ok) {
                setUsuario(respuesta.data.usuario);
            } else {
                logout();
            }
        } catch (error) {
            logout();
        } finally {
            setCargando(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const respuesta = await authService.login(username, password);
            if (respuesta.ok) {
                localStorage.setItem('token', respuesta.data.token);
                setToken(respuesta.data.token);
                setUsuario(respuesta.data.usuario);
                return { ok: true };
            }
            return respuesta;
        } catch (error) {
            return { ok: false, error: (error as any).message };
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                cargando,
                isAuthenticated: !!token && !!usuario,
                login,
                logout
            }}
        >
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
