'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, cargando } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!cargando && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [cargando, isAuthenticated, router]);

    if (cargando) {
        return (
            <div className="flex align-items-center justify-content-center h-screen">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
};
