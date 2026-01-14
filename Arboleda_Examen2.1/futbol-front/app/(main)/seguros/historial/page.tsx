'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cotizacionService } from '@/services/apiService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';

interface Cotizacion {
    id_cotizacion: number;
    id_conductor: number;
    id_vehiculo: number;
    fecha_vencimiento: string;
    monto_base: string;
    monto_recargos: string;
    monto_descuentos: string;
    monto_total: string;
    estado: string;
    mensaje_rechazo: string | null;
    acepta_terminos: boolean;
    fecha_creacion: string;
    conductor?: {
        nombre_completo: string;
        identificacion: string;
    };
    vehiculo?: {
        marca: string;
        modelo: string;
        anio_fabricacion: number;
        placa: string;
    };
}

export default function HistorialPage() {
    const toast = useRef<Toast>(null);

    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState<string>('');
    const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    const estadosOptions = [
        { label: 'Todos', value: '' },
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Aprobada', value: 'APROBADA' },
        { label: 'Rechazada', value: 'RECHAZADA' },
        { label: 'Vencida', value: 'VENCIDA' },
        { label: 'Pagada', value: 'PAGADA' }
    ];

    useEffect(() => {
        cargarCotizaciones();
    }, []);

    const cargarCotizaciones = async () => {
        setLoading(true);
        const response = await cotizacionService.obtenerTodas();
        if (response.ok) {
            setCotizaciones(response.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
        setLoading(false);
    };

    const handleVerDetalle = async (cotizacion: Cotizacion) => {
        // Cargar detalles completos
        const response = await cotizacionService.obtenerPorId(cotizacion.id_cotizacion);
        if (response.ok) {
            setSelectedCotizacion(response.data);
            setShowDetailDialog(true);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
        const response = await cotizacionService.actualizarEstado(id, nuevoEstado);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Estado actualizado a ${nuevoEstado}`
            });
            cargarCotizaciones();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const confirmarEliminar = (cotizacion: Cotizacion) => {
        confirmDialog({
            message: `¿Está seguro de eliminar la cotización #${cotizacion.id_cotizacion}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => handleEliminar(cotizacion.id_cotizacion)
        });
    };

    const handleEliminar = async (id: number) => {
        const response = await cotizacionService.eliminar(id);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cotización eliminada correctamente'
            });
            cargarCotizaciones();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const estadoTemplate = (rowData: Cotizacion) => {
        const estadoConfig: Record<string, { severity: string }> = {
            PENDIENTE: { severity: 'warning' },
            APROBADA: { severity: 'success' },
            RECHAZADA: { severity: 'danger' },
            VENCIDA: { severity: 'info' },
            PAGADA: { severity: 'success' }
        };

        const config = estadoConfig[rowData.estado] || { severity: 'info' };
        return <Tag value={rowData.estado} severity={config.severity as any} />;
    };

    const montoTemplate = (rowData: Cotizacion) => {
        return `$${parseFloat(rowData.monto_total).toFixed(2)}`;
    };

    const fechaTemplate = (rowData: Cotizacion) => {
        return new Date(rowData.fecha_creacion).toLocaleDateString('es-ES');
    };

    const vencimientoTemplate = (rowData: Cotizacion) => {
        const fechaVenc = new Date(rowData.fecha_vencimiento);
        const ahora = new Date();
        const estaVencida = fechaVenc < ahora;

        return (
            <span style={{ color: estaVencida ? 'red' : 'inherit' }}>
                {fechaVenc.toLocaleDateString('es-ES')}
                {estaVencida && ' ⚠️'}
            </span>
        );
    };

    const accionesTemplate = (rowData: Cotizacion) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-eye" rounded outlined severity="info" onClick={() => handleVerDetalle(rowData)} tooltip="Ver Detalles" />
                {rowData.estado === 'PENDIENTE' && (
                    <>
                        <Button icon="pi pi-check" rounded outlined severity="success" onClick={() => handleCambiarEstado(rowData.id_cotizacion, 'APROBADA')} tooltip="Aprobar" />
                        <Button icon="pi pi-times" rounded outlined severity="danger" onClick={() => handleCambiarEstado(rowData.id_cotizacion, 'RECHAZADA')} tooltip="Rechazar" />
                    </>
                )}
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarEliminar(rowData)} tooltip="Eliminar" />
            </div>
        );
    };

    const filteredCotizaciones = cotizaciones.filter((cot) => {
        if (estadoFilter && cot.estado !== estadoFilter) return false;
        return true;
    });

    const header = (
        <div className="flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="m-0">Historial de Cotizaciones</h2>
            <div className="flex gap-2">
                <Dropdown value={estadoFilter} options={estadosOptions} onChange={(e) => setEstadoFilter(e.value)} placeholder="Filtrar por estado" />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
            </div>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="col-12">
                <Card>
                    <DataTable
                        value={filteredCotizaciones}
                        loading={loading}
                        header={header}
                        globalFilter={globalFilter}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        emptyMessage="No se encontraron cotizaciones"
                        className="p-datatable-sm"
                    >
                        <Column field="id_cotizacion" header="ID" sortable style={{ width: '5rem' }} />
                        <Column field="conductor.nombre_completo" header="Conductor" sortable body={(rowData) => rowData.conductor?.nombre_completo || `ID: ${rowData.id_conductor}`} />
                        <Column field="vehiculo" header="Vehículo" body={(rowData) => (rowData.vehiculo ? `${rowData.vehiculo.marca} ${rowData.vehiculo.modelo} (${rowData.vehiculo.placa})` : `ID: ${rowData.id_vehiculo}`)} />
                        <Column field="monto_total" header="Monto Total" body={montoTemplate} sortable />
                        <Column field="estado" header="Estado" body={estadoTemplate} sortable />
                        <Column field="fecha_creacion" header="Fecha" body={fechaTemplate} sortable />
                        <Column field="fecha_vencimiento" header="Vencimiento" body={vencimientoTemplate} sortable />
                        <Column body={accionesTemplate} header="Acciones" style={{ width: '15rem' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog header={`Detalle de Cotización #${selectedCotizacion?.id_cotizacion || ''}`} visible={showDetailDialog} style={{ width: '800px' }} onHide={() => setShowDetailDialog(false)}>
                {selectedCotizacion && (
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Información General</h3>
                                <Tag value={selectedCotizacion.estado} severity={selectedCotizacion.estado === 'APROBADA' ? 'success' : selectedCotizacion.estado === 'RECHAZADA' ? 'danger' : 'warning'} />
                            </div>
                            <Divider />
                        </div>

                        <div className="col-6">
                            <strong>ID Cotización:</strong>
                            <p>{selectedCotizacion.id_cotizacion}</p>
                        </div>

                        <div className="col-6">
                            <strong>Fecha de Creación:</strong>
                            <p>{new Date(selectedCotizacion.fecha_creacion).toLocaleString('es-ES')}</p>
                        </div>

                        <div className="col-6">
                            <strong>Fecha de Vencimiento:</strong>
                            <p>{new Date(selectedCotizacion.fecha_vencimiento).toLocaleString('es-ES')}</p>
                        </div>

                        <div className="col-6">
                            <strong>Términos Aceptados:</strong>
                            <p>{selectedCotizacion.acepta_terminos ? 'Sí' : 'No'}</p>
                        </div>

                        {selectedCotizacion.conductor && (
                            <>
                                <div className="col-12 mt-3">
                                    <h3>Conductor</h3>
                                    <Divider />
                                </div>
                                <div className="col-6">
                                    <strong>Nombre:</strong>
                                    <p>{selectedCotizacion.conductor.nombre_completo}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Identificación:</strong>
                                    <p>{selectedCotizacion.conductor.identificacion}</p>
                                </div>
                            </>
                        )}

                        {selectedCotizacion.vehiculo && (
                            <>
                                <div className="col-12 mt-3">
                                    <h3>Vehículo</h3>
                                    <Divider />
                                </div>
                                <div className="col-6">
                                    <strong>Marca/Modelo:</strong>
                                    <p>
                                        {selectedCotizacion.vehiculo.marca} {selectedCotizacion.vehiculo.modelo}
                                    </p>
                                </div>
                                <div className="col-6">
                                    <strong>Año:</strong>
                                    <p>{selectedCotizacion.vehiculo.anio_fabricacion}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Placa:</strong>
                                    <p>{selectedCotizacion.vehiculo.placa}</p>
                                </div>
                            </>
                        )}

                        <div className="col-12 mt-3">
                            <h3>Montos</h3>
                            <Divider />
                        </div>

                        <div className="col-6">
                            <strong>Monto Base:</strong>
                            <p>${parseFloat(selectedCotizacion.monto_base).toFixed(2)}</p>
                        </div>

                        <div className="col-6">
                            <strong>Recargos:</strong>
                            <p className="text-orange-500">+${parseFloat(selectedCotizacion.monto_recargos).toFixed(2)}</p>
                        </div>

                        <div className="col-6">
                            <strong>Descuentos:</strong>
                            <p className="text-green-500">-${parseFloat(selectedCotizacion.monto_descuentos).toFixed(2)}</p>
                        </div>

                        <div className="col-6">
                            <strong>Total:</strong>
                            <p>
                                <strong className="text-2xl">${parseFloat(selectedCotizacion.monto_total).toFixed(2)}</strong>
                            </p>
                        </div>

                        {selectedCotizacion.mensaje_rechazo && (
                            <>
                                <div className="col-12 mt-3">
                                    <h3>Motivo de Rechazo</h3>
                                    <Divider />
                                </div>
                                <div className="col-12">
                                    <p className="text-red-500">{selectedCotizacion.mensaje_rechazo}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    );
}
