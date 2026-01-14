'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { equipoService } from '@/services/equipoService';
import { jugadorService } from '@/services/jugadorService';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [equipos, setEquipos] = useState<any[]>([]);
    const [jugadores, setJugadores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [equiposResp, jugadoresResp] = await Promise.all([equipoService.listar(), jugadorService.listar()]);
        if (equiposResp.ok) setEquipos(equiposResp.data);
        if (jugadoresResp.ok) setJugadores(jugadoresResp.data);
        setLoading(false);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <Card className="shadow-2">
                    <h1 className="text-3xl font-bold mb-3 text-900"> Sistema de Gestión de Fútbol</h1>
                    <p className="text-lg text-600 mb-0">Bienvenido al sistema de gestión de equipos y jugadores</p>
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Total Equipos</span>
                            <div className="text-900 font-bold text-4xl">{equipos.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-flag text-blue-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Total Jugadores</span>
                            <div className="text-900 font-bold text-4xl">{jugadores.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-users text-green-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Promedio por Equipo</span>
                            <div className="text-900 font-bold text-4xl">{equipos.length > 0 ? (jugadores.length / equipos.length).toFixed(1) : '0'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-chart-bar text-orange-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Estado</span>
                            <div className="text-900 font-bold text-xl">Sistema Activo</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-check-circle text-purple-500 text-2xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 lg:col-6">
                <Card className="shadow-2">
                    <h5 className="text-xl font-bold mb-3">Acciones Rápidas</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <Button label="Gestionar Equipos" icon="pi pi-flag" className="p-button-primary w-full mb-2" onClick={() => router.push('/gestion/equipos')} />
                        </div>
                        <div className="col-12 md:col-6">
                            <Button label="Gestionar Jugadores" icon="pi pi-users" className="p-button-success w-full mb-2" onClick={() => router.push('/gestion/jugadores')} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12 lg:col-6">
                <Card className="shadow-2">
                    <h5 className="text-xl font-bold mb-3">Resumen por Equipo</h5>
                    {equipos.length > 0 ? (
                        <div className="flex flex-column gap-2">
                            {equipos.slice(0, 5).map((equipo: any) => (
                                <div key={equipo.id_equipo} className="flex justify-content-between align-items-center p-3 border-round bg-gray-50">
                                    <span className="font-semibold text-900">{equipo.nombre}</span>
                                    <span className="text-600">{jugadores.filter((j) => j.id_equipo === equipo.id_equipo).length} jugadores</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-600">No hay equipos registrados</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
