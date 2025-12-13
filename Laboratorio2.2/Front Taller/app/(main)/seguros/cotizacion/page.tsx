'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { conductorService, vehiculoService, cotizacionService } from '@/services/apiService';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';
import styles from './cotizacion.module.scss';

interface Conductor {
    id_conductor: number;
    identificacion: string;
    nombre_completo: string;
    fecha_nacimiento: string;
    edad_calculada?: number;
}

interface Vehiculo {
    id_vehiculo: number;
    marca: string;
    modelo: string;
    anio_fabricacion: number;
    placa: string;
    tipo_vehiculo: string;
    antiguedad?: number;
    puede_cotizar?: boolean;
}

interface CotizacionResponse {
    mensaje: string;
    cotizacion: any;
    conductor: any;
    vehiculo: any;
    desglose_calculo: any[];
}

export default function CotizacionPage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [paso, setPaso] = useState(1);
    const [cargando, setCargando] = useState(false);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

    const [selectedConductor, setSelectedConductor] = useState<number | null>(null);
    const [selectedVehiculo, setSelectedVehiculo] = useState<number | null>(null);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    const [cotizacionResult, setCotizacionResult] = useState<CotizacionResponse | null>(null);

    useEffect(() => {
        cargarConductores();
        cargarVehiculos();
    }, []);

    const cargarConductores = async () => {
        const response = await conductorService.obtenerTodos();
        if (response.ok) {
            setConductores(response.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const cargarVehiculos = async () => {
        const response = await vehiculoService.obtenerTodos();
        if (response.ok) {
            setVehiculos(response.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const validarPaso1 = (): boolean => {
        if (!selectedConductor) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor seleccione un conductor'
            });
            return false;
        }

        if (!selectedVehiculo) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor seleccione un vehículo'
            });
            return false;
        }

        const vehiculoSeleccionado = vehiculos.find((v) => v.id_vehiculo === selectedVehiculo);
        if (vehiculoSeleccionado && !vehiculoSeleccionado.puede_cotizar) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'El vehículo seleccionado no puede ser cotizado (antigüedad mayor a 20 años)'
            });
            return false;
        }

        return true;
    };

    const handleCotizar = async () => {
        if (!aceptaTerminos) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe aceptar los términos y condiciones'
            });
            return;
        }

        setCargando(true);
        const response = await cotizacionService.calcular({
            id_conductor: selectedConductor,
            id_vehiculo: selectedVehiculo,
            acepta_terminos: aceptaTerminos
        });
        setCargando(false);

        if (response.ok) {
            setCotizacionResult(response.data);
            setPaso(2);
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cotización generada correctamente'
            });
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const handleNuevaCotizacion = () => {
        setSelectedConductor(null);
        setSelectedVehiculo(null);
        setAceptaTerminos(false);
        setCotizacionResult(null);
        setPaso(1);
    };

    const handleVerHistorial = () => {
        router.push('/seguros/historial');
    };

    const conductorSeleccionado = conductores.find((c) => c.id_conductor === selectedConductor);
    const vehiculoSeleccionado = vehiculos.find((v) => v.id_vehiculo === selectedVehiculo);

    return (
        <div className={styles.container}>
            <Toast ref={toast} />

            <div className={styles.header}>
                <h1>Cotizador de Seguros Vehiculares</h1>
                <p>Calcula el costo de tu seguro en tiempo real</p>
            </div>

            {paso === 1 && (
                <Card className={styles.card}>
                    <h2>Paso 1: Seleccionar Conductor y Vehículo</h2>

                    <div className={styles.section}>
                        <h3>👤 Conductor</h3>
                        <Divider />

                        <div className={styles.formGroup}>
                            <label>Seleccionar Conductor *</label>
                            <Dropdown
                                value={selectedConductor}
                                onChange={(e) => setSelectedConductor(e.value)}
                                options={conductores.map((c) => ({
                                    label: `${c.nombre_completo} - ${c.identificacion} (${c.edad_calculada || '-'} años)`,
                                    value: c.id_conductor
                                }))}
                                placeholder="Seleccione un conductor"
                                filter
                                showClear
                                className="w-full"
                            />
                            {conductores.length === 0 && <Message severity="info" text="No hay conductores registrados. Por favor, registre uno primero." className="mt-2" />}
                            <Button label="Registrar Nuevo Conductor" icon="pi pi-plus" className="p-button-outlined mt-2" onClick={() => router.push('/seguros/conductores')} />
                        </div>

                        {conductorSeleccionado && (
                            <div className={styles.infoBox}>
                                <p>
                                    <strong>Nombre:</strong> {conductorSeleccionado.nombre_completo}
                                </p>
                                <p>
                                    <strong>Identificación:</strong> {conductorSeleccionado.identificacion}
                                </p>
                                <p>
                                    <strong>Edad:</strong> {conductorSeleccionado.edad_calculada || '-'} años
                                </p>
                                <p>
                                    <strong>Email:</strong> {conductorSeleccionado.fecha_nacimiento}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>🚗 Vehículo</h3>
                        <Divider />

                        <div className={styles.formGroup}>
                            <label>Seleccionar Vehículo *</label>
                            <Dropdown
                                value={selectedVehiculo}
                                onChange={(e) => setSelectedVehiculo(e.value)}
                                options={vehiculos.map((v) => ({
                                    label: `${v.marca} ${v.modelo} (${v.anio_fabricacion}) - ${v.placa} ${!v.puede_cotizar ? '⚠️ NO COTIZABLE' : ''}`,
                                    value: v.id_vehiculo,
                                    disabled: !v.puede_cotizar
                                }))}
                                placeholder="Seleccione un vehículo"
                                filter
                                showClear
                                className="w-full"
                            />
                            {vehiculos.length === 0 && <Message severity="info" text="No hay vehículos registrados. Por favor, registre uno primero." className="mt-2" />}
                            <Button label="Registrar Nuevo Vehículo" icon="pi pi-plus" className="p-button-outlined mt-2" onClick={() => router.push('/seguros/vehiculos')} />
                        </div>

                        {vehiculoSeleccionado && (
                            <div className={styles.infoBox}>
                                <p>
                                    <strong>Vehículo:</strong> {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                                </p>
                                <p>
                                    <strong>Año:</strong> {vehiculoSeleccionado.anio_fabricacion}
                                </p>
                                <p>
                                    <strong>Placa:</strong> {vehiculoSeleccionado.placa}
                                </p>
                                <p>
                                    <strong>Tipo:</strong> {vehiculoSeleccionado.tipo_vehiculo}
                                </p>
                                <p>
                                    <strong>Antigüedad:</strong> {vehiculoSeleccionado.antiguedad || '-'} años
                                </p>
                                {!vehiculoSeleccionado.puede_cotizar && <Tag severity="danger" value="NO PUEDE SER COTIZADO" icon="pi pi-exclamation-triangle" />}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <div className={styles.checkboxGroup}>
                            <Checkbox inputId="terminos" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.checked || false)} />
                            <label htmlFor="terminos">Acepto los términos y condiciones del servicio de cotización *</label>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button
                            label="Calcular Cotización"
                            icon="pi pi-calculator"
                            onClick={() => {
                                if (validarPaso1()) {
                                    handleCotizar();
                                }
                            }}
                            loading={cargando}
                            className="p-button-primary"
                            disabled={!selectedConductor || !selectedVehiculo || !aceptaTerminos}
                        />
                    </div>
                </Card>
            )}

            {paso === 2 && cotizacionResult && (
                <Card className={styles.card}>
                    <h2>✅ Cotización Generada</h2>

                    <div className={styles.resumenCard}>
                        <div className={styles.resumenHeader}>
                            <div>
                                <p className={styles.numeroCotizacion}>Cotización #{cotizacionResult.cotizacion.id_cotizacion}</p>
                                <p className={styles.fecha}>Generada: {new Date(cotizacionResult.cotizacion.createdAt).toLocaleDateString('es-ES')}</p>
                                <p className={styles.fecha}>Vence: {new Date(cotizacionResult.cotizacion.fecha_vencimiento).toLocaleDateString('es-ES')}</p>
                            </div>
                            <Tag value={cotizacionResult.cotizacion.estado} severity={cotizacionResult.cotizacion.estado === 'PENDIENTE' ? 'warning' : cotizacionResult.cotizacion.estado === 'APROBADA' ? 'success' : 'danger'} />
                        </div>

                        <Divider />

                        <div className={styles.resumenGrid}>
                            <div className={styles.resumenItem}>
                                <span className={styles.label}>Conductor:</span>
                                <span className={styles.valor}>{cotizacionResult.informacion.conductor.nombre}</span>
                            </div>
                            <div className={styles.resumenItem}>
                                <span className={styles.label}>Vehículo:</span>
                                <span className={styles.valor}>
                                    {cotizacionResult.informacion.vehiculo.marca} {cotizacionResult.informacion.vehiculo.modelo} ({cotizacionResult.informacion.vehiculo.antiguedad} años)
                                </span>
                            </div>
                            <div className={styles.resumenItem}>
                                <span className={styles.label}>Tipo:</span>
                                <span className={styles.valor}>{cotizacionResult.informacion.vehiculo.tipo}</span>
                            </div>
                            <div className={styles.resumenItem}>
                                <span className={styles.label}>Uso:</span>
                                <span className={styles.valor}>{cotizacionResult.informacion.vehiculo.uso}</span>
                            </div>
                        </div>

                        <Divider />

                        <div className={styles.costos}>
                            <h3>📊 Desglose de Cálculo</h3>
                            <div className={styles.desglose}>
                                <div className={styles.desgloceItem}>
                                    <span>Monto Base:</span>
                                    <span>${parseFloat(cotizacionResult.cotizacion.monto_base).toFixed(2)}</span>
                                </div>
                                <div className={styles.desgloceItem}>
                                    <span>Recargos:</span>
                                    <span className="text-orange-500">+${parseFloat(cotizacionResult.cotizacion.monto_recargos).toFixed(2)}</span>
                                </div>
                                {parseFloat(cotizacionResult.cotizacion.monto_descuentos) > 0 && (
                                    <div className={styles.desgloceItem}>
                                        <span>Descuentos:</span>
                                        <span className="text-green-500">-${parseFloat(cotizacionResult.cotizacion.monto_descuentos).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {cotizacionResult.detalleCalculo && cotizacionResult.detalleCalculo.length > 0 && (
                                <>
                                    <Divider />
                                    <h4>Detalles del Cálculo:</h4>
                                    <ul className={styles.detallesList}>
                                        {cotizacionResult.detalleCalculo.map((item: any, index: number) => (
                                            <li key={index} className={item.monto && parseFloat(item.monto) < 0 ? 'text-green-500' : item.monto ? 'text-orange-500' : ''}>
                                                <strong>{item.concepto}</strong>
                                                {item.monto && <span> → ${Math.abs(parseFloat(item.monto)).toFixed(2)}</span>}
                                                {item.nota && <span className="text-sm text-gray-500"> ({item.nota})</span>}
                                                {item.advertencia && <Tag severity="warning" value={item.advertencia} className="ml-2" />}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-3 p-3 bg-blue-50 border-round">
                                        <h5 className="mt-0 mb-2">📊 Porcentajes Aplicados:</h5>
                                        <ul className="list-none p-0 m-0 text-sm">
                                            <li>
                                                • Descuento sin accidentes: <strong>10%</strong>
                                            </li>
                                            <li>
                                                • Recargo conductor joven (18-24 años): <strong>25%</strong>
                                            </li>
                                            <li>
                                                • Recargo mayor de 65 años: <strong>15%</strong>
                                            </li>
                                            <li>
                                                • Recargo uso comercial: <strong>20%</strong>
                                            </li>
                                            <li>
                                                • Recargo por accidente: <strong>10% c/u</strong>
                                            </li>
                                            <li>
                                                • Recargo más de 3 accidentes: <strong>50%</strong>
                                            </li>
                                            <li>
                                                • Factor valor vehículo: <strong>2% del valor</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.resumenTotal}>
                            <div className={styles.totalItem}>
                                <span>Monto Total:</span>
                                <strong>${parseFloat(cotizacionResult.cotizacion.monto_total).toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className={styles.infoAlert}>
                            <Message severity="info" text={cotizacionResult.mensaje || 'Cotización generada exitosamente'} />
                            {cotizacionResult.cotizacion.mensaje_rechazo && <Message severity="error" text={cotizacionResult.cotizacion.mensaje_rechazo} />}
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button label="Nueva Cotización" icon="pi pi-plus" onClick={handleNuevaCotizacion} className="p-button-secondary" />
                        <Button label="Ver Historial" icon="pi pi-list" onClick={handleVerHistorial} className="p-button-info" />
                    </div>
                </Card>
            )}
        </div>
    );
}
