'use client';
import Layout from '../../layout/layout';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return <Layout>{children}</Layout>;
}
