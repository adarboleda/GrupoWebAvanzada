import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { usuario, token, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && (!usuario || !token)) {
      router.push('/auth/login');
    }
  }, [cargando, usuario, token, router]);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return usuario && token ? <>{children}</> : null;
};
