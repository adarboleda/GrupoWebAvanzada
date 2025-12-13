'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { cotizacionService, pagoService, conductorService, vehiculoService } from '@/services/apiService';

let estadisticasChartData: ChartData;
let estadisticasChartOptions: ChartOptions<'bar'>;

function Dashboard() {
    const [cotizaciones, setCotizaciones] = useState<any[]>([]);
    const [pagos, setPagos] = useState<any[]>([]);
    const [conductores, setConductores] = useState<any[]>([]);
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { layoutConfig } = useContext(LayoutContext);

    const getEstadisticasChartData = (): ChartData<'bar'> => {
        const cotizacionesPorEstado = {
            PENDIENTE: cotizaciones.filter((c) => c.estado === 'PENDIENTE').length,
            APROBADA: cotizaciones.filter((c) => c.estado === 'APROBADA').length,
            RECHAZADA: cotizaciones.filter((c) => c.estado === 'RECHAZADA').length,
            VENCIDA: cotizaciones.filter((c) => c.estado === 'VENCIDA').length
        };

        return {
            labels: ['Pendiente', 'Aprobada', 'Rechazada', 'Vencida'],
            datasets: [
                {
                    label: 'Cotizaciones',
                    data: [cotizacionesPorEstado.PENDIENTE, cotizacionesPorEstado.APROBADA, cotizacionesPorEstado.RECHAZADA, cotizacionesPorEstado.VENCIDA],
                    backgroundColor: ['rgba(255, 193, 7, 0.8)', 'rgba(25, 135, 84, 0.8)', 'rgba(220, 53, 69, 0.8)', 'rgba(108, 117, 125, 0.8)'],
                    borderColor: ['rgb(255, 193, 7)', 'rgb(25, 135, 84)', 'rgb(220, 53, 69)', 'rgb(108, 117, 125)'],
                    borderWidth: 1
                }
            ]
        };
    };

    const getChartOptions = (): ChartOptions<'bar'> => {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || '#212529';
        const surface300 = getComputedStyle(document.body).getPropertyValue('--surface-300') || '#dee2e6';
        return {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: surface300
                    }
                },
                x: {
                    grid: {
                        color: surface300
                    }
                }
            }
        };
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (cotizaciones.length > 0) {
            estadisticasChartData = getEstadisticasChartData();
            estadisticasChartOptions = getChartOptions();
        }
    }, [cotizaciones, layoutConfig]);

    const cargarDatos = async () => {
        setLoading(true);

        const [cotResp, pagResp, condResp, vehResp] = await Promise.all([cotizacionService.obtenerTodas(), pagoService.obtenerTodos(), conductorService.obtenerTodos(), vehiculoService.obtenerTodos()]);

        if (cotResp.ok) setCotizaciones(cotResp.data);
        if (pagResp.ok) setPagos(pagResp.data);
        if (condResp.ok) setConductores(condResp.data);
        if (vehResp.ok) setVehiculos(vehResp.data);

        setLoading(false);
    };

    const calcularTotalIngresos = () => {
        return pagos.filter((p) => p.estado_transaccion === 'EXITOSO').reduce((acc, p) => acc + parseFloat(p.monto_pagado || 0), 0);
    };

    const estadoTemplate = (rowData: any) => {
        const estadoConfig: Record<string, { severity: string }> = {
            PENDIENTE: { severity: 'warning' },
            APROBADA: { severity: 'success' },
            RECHAZADA: { severity: 'danger' },
            VENCIDA: { severity: 'info' }
        };

        const config = estadoConfig[rowData.estado] || { severity: 'info' };
        return <Tag value={rowData.estado} severity={config.severity as any} />;
    };

    const montoTemplate = (rowData: any) => {
        return `$${parseFloat(rowData.monto_total).toFixed(2)}`;
    };

    const fechaTemplate = (rowData: any) => {
        return new Date(rowData.fecha_creacion).toLocaleDateString('es-ES');
    };

    const cotizacionesRecientes = cotizaciones.slice(0, 5);

    return (
        <>
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-3 text-white h-6rem border-round m-0 bg-center bg-cover bg-no-repeat bg-cyan-400" style={{ backgroundImage: 'url(/demo/images/dashboard/effect-1.svg)' }}>
                        <div className="font-bold w-full mb-3">
                            <span>Total Cotizaciones</span>
                        </div>
                        <div className="text-white text-2xl font-bold w-full flex align-items-center py-1">
                            {cotizaciones.length} <i className="pi pi-file ml-2 font-bold"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-3 text-white h-6rem border-round m-0 bg-center bg-cover bg-no-repeat bg-green-400" style={{ backgroundImage: 'url(/demo/images/dashboard/effect-2.svg)' }}>
                        <div className="font-bold w-full mb-3">
                            <span>Ingresos Totales</span>
                        </div>
                        <div className="text-white text-2xl font-bold w-full flex align-items-center py-1">
                            ${calcularTotalIngresos().toFixed(2)} <i className="pi pi-dollar ml-2 font-bold"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-3 text-white h-6rem border-round m-0 bg-center bg-cover bg-no-repeat bg-orange-400" style={{ backgroundImage: 'url(/demo/images/dashboard/effect-3.svg)' }}>
                        <div className="font-bold w-full mb-3">
                            <span>Conductores Registrados</span>
                        </div>
                        <div className="text-white text-2xl font-bold w-full flex align-items-center py-1">
                            {conductores.length} <i className="pi pi-users ml-2 font-bold"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-3 text-white h-6rem border-round m-0 bg-center bg-cover bg-no-repeat bg-purple-400" style={{ backgroundImage: 'url(/demo/images/dashboard/effect-4.svg)' }}>
                        <div className="font-bold w-full mb-3">
                            <span>Vehículos Asegurados</span>
                        </div>
                        <div className="text-white text-2xl font-bold w-full flex align-items-center py-1">
                            {vehiculos.length} <i className="pi pi-car ml-2 font-bold"></i>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <Card>
                        <h5>Estadísticas de Cotizaciones</h5>
                        <Chart type="bar" data={estadisticasChartData} options={estadisticasChartOptions} id="cotizaciones-chart"></Chart>
                    </Card>
                </div>

                <div className="col-12 lg:col-6">
                    <Card>
                        <h5>Resumen de Pagos</h5>
                        <div className="grid">
                            <div className="col-12 md:col-4">
                                <div className="text-center p-3 border-round border-1 surface-border">
                                    <div className="text-green-500 font-bold text-3xl mb-2">{pagos.filter((p) => p.estado_transaccion === 'EXITOSO').length}</div>
                                    <div className="text-500">Pagos Exitosos</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="text-center p-3 border-round border-1 surface-border">
                                    <div className="text-orange-500 font-bold text-3xl mb-2">{pagos.filter((p) => p.estado_transaccion === 'PENDIENTE').length}</div>
                                    <div className="text-500">Pagos Pendientes</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="text-center p-3 border-round border-1 surface-border">
                                    <div className="text-red-500 font-bold text-3xl mb-2">{pagos.filter((p) => p.estado_transaccion === 'FALLIDO').length}</div>
                                    <div className="text-500">Pagos Fallidos</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6>Distribución por Modalidad</h6>
                            <ul className="mt-3 p-0 mx-0 list-none">
                                <li className="flex align-items-center py-2">
                                    <span className="border-round bg-cyan-500 mr-3 w-1rem h-1rem"></span>
                                    <span className="text-xl font-medium text-color">Contado</span>
                                    <span className="text-xl font-medium text-color-secondary ml-auto">{pagos.filter((p) => p.modalidad_pago === 'CONTADO').length}</span>
                                </li>
                                <li className="flex align-items-center py-2">
                                    <span className="border-round bg-orange-500 mr-3 w-1rem h-1rem"></span>
                                    <span className="text-xl font-medium text-color">Diferido</span>
                                    <span className="text-xl font-medium text-color-secondary ml-auto">{pagos.filter((p) => p.modalidad_pago === 'DIFERIDO').length}</span>
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>

                <div className="col-12">
                    <Card>
                        <div className="flex align-items-center justify-content-between mb-4">
                            <h5>Cotizaciones Recientes</h5>
                            <Button label="Ver Todas" icon="pi pi-arrow-right" text onClick={() => (window.location.href = '/seguros/historial')} />
                        </div>
                        <DataTable value={cotizacionesRecientes} loading={loading} emptyMessage="No hay cotizaciones recientes" className="p-datatable-sm">
                            <Column field="id_cotizacion" header="ID" style={{ width: '5rem' }} />
                            <Column field="conductor.nombre_completo" header="Conductor" body={(rowData) => rowData.conductor?.nombre_completo || `ID: ${rowData.id_conductor}`} />
                            <Column field="vehiculo" header="Vehículo" body={(rowData) => (rowData.vehiculo ? `${rowData.vehiculo.marca} ${rowData.vehiculo.modelo}` : `ID: ${rowData.id_vehiculo}`)} />
                            <Column field="monto_total" header="Monto" body={montoTemplate} />
                            <Column field="estado" header="Estado" body={estadoTemplate} />
                            <Column field="fecha_creacion" header="Fecha" body={fechaTemplate} />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
