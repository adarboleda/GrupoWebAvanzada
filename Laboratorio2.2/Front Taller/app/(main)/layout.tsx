'use client';
import Layout from '../../layout/layout';
import { PrivateRoute } from '@/components/PrivateRoute';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <PrivateRoute>
            <Layout>{children}</Layout>
        </PrivateRoute>
    );
}
