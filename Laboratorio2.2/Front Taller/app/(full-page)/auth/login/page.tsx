'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Page } from '../../../../types/layout';

const Login: Page = () => {
    const router = useRouter();
    const { login: authLogin } = useAuth();
    const toastRef = useRef<Toast>(null);
    const [email, setEmail] = useState('cliente@seguros.com');
    const [password, setPassword] = useState('abcd');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Por favor completa todos los campos',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await authLogin(email, password);

            if (response.success) {
                toastRef.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Iniciando sesión...',
                });
                
                setTimeout(() => {
                    router.push('/seguros/historial');
                }, 1000);
            } else {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.error || 'Error al iniciar sesión',
                });
            }
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: mensaje,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            <div className="overflow-hidden margin-0 relative h-screen">
                <div className="bg-cover bg-center" style={{ backgroundImage: 'url(/layout/images/pages/login/bg-login.jpg)', height: 'calc(100% - 370px)' }}></div>
                <div className="w-full absolute mb-0 bottom-0 text-center surface-900 border-noround p-fluid h-27rem">
                    <div className="px-6 md:p-0 w-29rem relative text-white" style={{ marginLeft: ' -200px', top: '30px', left: '50%' }}>
                        <div className="grid">
                            <div className="col-3 text-left">
                                <img src="/layout/images/pages/login/icon-login.svg" alt="avalon-react" />
                            </div>
                            <div className="col-9 text-left">
                                <h2 className="mb-0 text-0">Sistema de Seguros</h2>
                                <span className="text-500 text-sm">Cotización de Seguros Vehiculares</span>
                            </div>
                            <div className="col-12 text-left">
                                <label className="text-400 mb-1">Email</label>
                                <div className="mt-1">
                                    <InputText 
                                        type="email" 
                                        placeholder="Correo" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="col-12 text-left">
                                <label className="text-400 mb-1">Contraseña</label>
                                <div className="mt-1">
                                    <InputText 
                                        type="password" 
                                        placeholder="Contraseña" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <Button 
                                    onClick={handleLogin} 
                                    label="Iniciar Sesión"
                                    loading={loading}
                                    disabled={loading}
                                ></Button>
                            </div>
                            <div className="col-12 md:col-6">
                                <Button text className="text-gray-300 flex justify-content-center">
                                    Prueba: cliente@seguros.com / abcd
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
