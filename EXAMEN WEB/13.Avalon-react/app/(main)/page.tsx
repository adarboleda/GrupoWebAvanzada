"use client";
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { EquipoService } from "@/demo/service/equipoService";
import { JugadorService } from "@/demo/service/jugadorService";

const Dashboard = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalEquipos: 0,
        totalJugadores: 0,
    });
    const [loading, setLoading] = useState(true);

    const equipoService = new EquipoService();
    const jugadorService = new JugadorService();

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            const [equipos, jugadores] = await Promise.all([
                equipoService.obtenerEquipos(),
                jugadorService.obtenerJugadores(),
            ]);
            setStats({
                totalEquipos: equipos.length,
                totalJugadores: jugadores.length,
            });
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <Card title="Sistema de Gestión de Equipos y Jugadores" className="mb-4">
                    <p className="m-0">
                        Bienvenido al sistema de gestión de equipos y jugadores. Aquí podrás administrar
                        todos los equipos y sus jugadores asociados.
                    </p>
                </Card>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <Card className="mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Equipos</span>
                            <div className="text-900 font-medium text-xl">
                                {loading ? "..." : stats.totalEquipos}
                            </div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style={{ width: "2.5rem", height: "2.5rem" }}
                        >
                            <i className="pi pi-users text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <Button
                        label="Ver Equipos"
                        icon="pi pi-arrow-right"
                        className="p-button-text"
                        onClick={() => router.push("/equipos")}
                    />
                </Card>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <Card className="mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Jugadores</span>
                            <div className="text-900 font-medium text-xl">
                                {loading ? "..." : stats.totalJugadores}
                            </div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-green-100 border-round"
                            style={{ width: "2.5rem", height: "2.5rem" }}
                        >
                            <i className="pi pi-user text-green-500 text-xl"></i>
                        </div>
                    </div>
                    <Button
                        label="Ver Jugadores"
                        icon="pi pi-arrow-right"
                        className="p-button-text"
                        onClick={() => router.push("/jugadores")}
                    />
                </Card>
            </div>

            <div className="col-12">
                <Card title="Acciones Rápidas">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <Button
                                label="Registrar Equipo"
                                icon="pi pi-plus"
                                className="p-button-success w-full"
                                onClick={() => router.push("/equipos")}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <Button
                                label="Registrar Jugador"
                                icon="pi pi-plus"
                                className="p-button-success w-full"
                                onClick={() => router.push("/jugadores")}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="col-12">
                <Card title="Información del Sistema">
                    <ul>
                        <li>Gestión completa de equipos con información detallada</li>
                        <li>Registro de jugadores con asignación a equipos</li>
                        <li>Control de números de camiseta únicos por equipo</li>
                        <li>Filtrado de jugadores por equipo</li>
                        <li>Operaciones CRUD completas para ambas entidades</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
