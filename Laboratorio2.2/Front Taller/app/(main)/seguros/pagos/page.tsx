'use client';

import React, { useEffect, useState, useRef } from 'react';
import { pagoService, cotizacionService } from '@/services/apiService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';

interface Pago {
    id_pago: number;
    id_cotizacion: number;
    tipo_tarjeta: string;
    modalidad_pago: string;
    numero_cuotas: number;
    monto_pagado: string;
    estado_transaccion: string;
    codigo_referencia_pasarela: string;
    fecha_pago: string;
    createdAt: string;
}

interface Cotizacion {
    id_cotizacion: number;
    monto_total: string;
    estado: string;
}

export default function PagosPage() {
    const toast = useRef<Toast>(null);

    const [pagos, setPagos] = useState<Pago[]>([]);
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const [formData, setFormData] = useState({
        id_cotizacion: null as number | null,
        tipo_tarjeta: 'DEBITO',
        modalidad_pago: 'CONTADO',
        numero_cuotas: 1,
        codigo_referencia_pasarela: ''
    });

    const tiposTarjeta = [
        { label: 'Débito', value: 'DEBITO' },
        { label: 'Crédito', value: 'CREDITO' }
    ];

    const modalidadesPago = [
        { label: 'Contado', value: 'CONTADO' },
        { label: 'Diferido', value: 'DIFERIDO' }
    ];

    useEffect(() => {
        cargarPagos();
        cargarCotizacionesAprobadas();
    }, []);

    const cargarPagos = async () => {
        setLoading(true);
        const response = await pagoService.obtenerTodos();
        if (response.ok) {
            setPagos(response.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
        setLoading(false);
    };

    const cargarCotizacionesAprobadas = async () => {
        const response = await cotizacionService.obtenerTodas();
        if (response.ok) {
            // Filtrar solo cotizaciones APROBADAS
            const aprobadas = response.data.filter((c: any) => c.estado === 'APROBADA');
            setCotizaciones(aprobadas);
        }
    };

    const abrirDialogNuevo = () => {
        setFormData({
            id_cotizacion: null,
            tipo_tarjeta: 'DEBITO',
            modalidad_pago: 'CONTADO',
            numero_cuotas: 1,
            codigo_referencia_pasarela: `REF-${Date.now()}`
        });
        setShowDialog(true);
    };

    const handleSubmit = async () => {
        if (!formData.id_cotizacion) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor seleccione una cotización'
            });
            return;
        }

        const datos = {
            id_cotizacion: formData.id_cotizacion,
            tipo_tarjeta: formData.tipo_tarjeta,
            modalidad_pago: formData.modalidad_pago,
            numero_cuotas: formData.numero_cuotas,
            codigo_referencia_pasarela: formData.codigo_referencia_pasarela || `REF-${Date.now()}`
        };

        const response = await pagoService.procesar(datos);

        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago procesado correctamente'
            });
            setShowDialog(false);
            cargarPagos();
            cargarCotizacionesAprobadas();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const confirmarReintentar = (pago: Pago) => {
        if (pago.estado_transaccion !== 'FALLIDO') {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Solo se pueden reintentar pagos fallidos'
            });
            return;
        }

        confirmDialog({
            message: `¿Desea reintentar el pago #${pago.id_pago}?`,
            header: 'Confirmar Reintento',
            icon: 'pi pi-refresh',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => handleReintentar(pago.id_pago)
        });
    };

    const handleReintentar = async (id: number) => {
        const response = await pagoService.reintentar(id);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago reintentado correctamente'
            });
            cargarPagos();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const confirmarEliminar = (pago: Pago) => {
        confirmDialog({
            message: `¿Está seguro de eliminar el pago #${pago.id_pago}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => handleEliminar(pago.id_pago)
        });
    };

    const handleEliminar = async (id: number) => {
        const response = await pagoService.eliminar(id);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pago eliminado correctamente'
            });
            cargarPagos();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const estadoPagoTemplate = (rowData: Pago) => {
        const estadoConfig: Record<string, { severity: string }> = {
            EXITOSO: { severity: 'success' },
            PENDIENTE: { severity: 'warning' },
            FALLIDO: { severity: 'danger' }
        };

        const config = estadoConfig[rowData.estado_transaccion] || { severity: 'info' };
        return <Tag value={rowData.estado_transaccion} severity={config.severity as any} />;
    };

    const montoTemplate = (rowData: Pago) => {
        return `$${parseFloat(rowData.monto_pagado).toFixed(2)}`;
    };

    const fechaTemplate = (rowData: Pago) => {
        return new Date(rowData.fecha_pago || rowData.createdAt).toLocaleDateString('es-ES');
    };

    const accionesTemplate = (rowData: Pago) => {
        return (
            <div className="flex gap-2">
                {rowData.estado_transaccion === 'FALLIDO' && <Button icon="pi pi-refresh" rounded outlined severity="warning" onClick={() => confirmarReintentar(rowData)} tooltip="Reintentar" />}
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarEliminar(rowData)} tooltip="Eliminar" />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h2 className="m-0">Gestión de Pagos</h2>
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
                <Button label="Procesar Pago" icon="pi pi-plus" onClick={abrirDialogNuevo} />
            </div>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="col-12">
                <Card>
                    <DataTable value={pagos} loading={loading} header={header} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="No se encontraron pagos" className="p-datatable-sm">
                        <Column field="id_pago" header="ID" sortable />
                        <Column field="id_cotizacion" header="Cotización" sortable />
                        <Column field="tipo_tarjeta" header="Tarjeta" sortable />
                        <Column field="modalidad_pago" header="Modalidad" sortable />
                        <Column field="numero_cuotas" header="Cuotas" sortable />
                        <Column field="monto_pagado" header="Monto" body={montoTemplate} sortable />
                        <Column field="estado_transaccion" header="Estado" body={estadoPagoTemplate} sortable />
                        <Column field="fecha_pago" header="Fecha" body={fechaTemplate} sortable />
                        <Column body={accionesTemplate} header="Acciones" style={{ width: '10rem' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog
                header="Procesar Pago"
                visible={showDialog}
                style={{ width: '600px' }}
                onHide={() => setShowDialog(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setShowDialog(false)} />
                        <Button label="Procesar" icon="pi pi-check" onClick={handleSubmit} />
                    </div>
                }
            >
                <div className="grid p-fluid">
                    <div className="col-12">
                        <label htmlFor="cotizacion">Cotización Aprobada *</label>
                        <Dropdown
                            id="cotizacion"
                            value={formData.id_cotizacion}
                            options={cotizaciones.map((c) => ({
                                label: `Cotización #${c.id_cotizacion} - $${parseFloat(c.monto_total).toFixed(2)}`,
                                value: c.id_cotizacion
                            }))}
                            onChange={(e) => setFormData({ ...formData, id_cotizacion: e.value })}
                            placeholder="Seleccione una cotización"
                        />
                    </div>

                    <div className="col-6">
                        <label htmlFor="tipo_tarjeta">Tipo de Tarjeta *</label>
                        <Dropdown id="tipo_tarjeta" value={formData.tipo_tarjeta} options={tiposTarjeta} onChange={(e) => setFormData({ ...formData, tipo_tarjeta: e.value })} />
                    </div>

                    <div className="col-6">
                        <label htmlFor="modalidad">Modalidad de Pago *</label>
                        <Dropdown
                            id="modalidad"
                            value={formData.modalidad_pago}
                            options={modalidadesPago}
                            onChange={(e) => {
                                const newModalidad = e.value;
                                setFormData({
                                    ...formData,
                                    modalidad_pago: newModalidad,
                                    numero_cuotas: newModalidad === 'CONTADO' ? 1 : formData.numero_cuotas
                                });
                            }}
                        />
                    </div>

                    {formData.modalidad_pago === 'DIFERIDO' && (
                        <div className="col-12">
                            <label htmlFor="cuotas">Número de Cuotas *</label>
                            <InputNumber id="cuotas" value={formData.numero_cuotas} onValueChange={(e) => setFormData({ ...formData, numero_cuotas: e.value || 1 })} min={2} max={12} />
                        </div>
                    )}

                    <div className="col-12">
                        <label htmlFor="referencia">Código de Referencia</label>
                        <InputText id="referencia" value={formData.codigo_referencia_pasarela} onChange={(e) => setFormData({ ...formData, codigo_referencia_pasarela: e.target.value })} placeholder="Código de pasarela de pago" />
                        <small>Se generará automáticamente si se deja vacío</small>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
