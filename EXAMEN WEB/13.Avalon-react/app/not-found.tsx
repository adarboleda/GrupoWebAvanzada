import React from 'react';
import type { Page } from '@/types';

const Custom404: Page = () => {
    return (
        <div className="flex align-items-center justify-content-center min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-3">404</h1>
                <p className="text-xl mb-4">Página no encontrada</p>
                <a href="/" className="text-primary hover:underline">Volver al inicio</a>
            </div>
        </div>
    );
};

export default Custom404;
