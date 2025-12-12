'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { AuthProvider } from '../../context/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <AuthProvider>
            <Layout>{children}</Layout>
        </AuthProvider>
    );
}
