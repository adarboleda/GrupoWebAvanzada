'use client';

import React, { useEffect, useState, useRef } from 'react';
import { vehiculoService } from '@/services/apiService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';

interface Vehiculo {
    id_vehiculo: number;
    marca: string;
    modelo: string;
    anio_fabricacion: number;
    placa: string;
    valor_mercado: string;
    tipo_vehiculo: string;
    uso_vehiculo: string;
    antiguedad?: number;
    puede_cotizar?: boolean;
    createdAt: string;
}

interface FormData {
    marca: string;
    modelo: string;
    anio_fabricacion: number;
    placa: string;
    valor_mercado: number;
    tipo_vehiculo: string;
    uso_vehiculo: string;
}

export default function VehiculosPage() {
    const toast = useRef<Toast>(null);

    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState<FormData>({
        marca: '',
        modelo: '',
        anio_fabricacion: new Date().getFullYear(),
        placa: '',
        valor_mercado: 10000,
        tipo_vehiculo: 'SEDAN',
        uso_vehiculo: 'PERSONAL'
    });

    const tiposVehiculo = [
        { label: 'Sedán', value: 'SEDAN' },
        { label: 'SUV', value: 'SUV' },
        { label: 'Camioneta', value: 'CAMIONETA' },
        { label: 'Otro', value: 'OTRO' }
    ];

    const usoVehiculo = [
        { label: 'Personal', value: 'PERSONAL' },
        { label: 'Comercial', value: 'COMERCIAL' }
    ];

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    const abrirDialogNuevo = () => {
        setFormData({
            marca: '',
            modelo: '',
            anio_fabricacion: new Date().getFullYear(),
            placa: '',
            valor_mercado: 10000,
            tipo_vehiculo: 'SEDAN',
            uso_vehiculo: 'PERSONAL'
        });
        setEditMode(false);
        setSelectedId(null);
        setShowDialog(true);
    };

    const abrirDialogEditar = (vehiculo: Vehiculo) => {
        setFormData({
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            anio_fabricacion: vehiculo.anio_fabricacion,
            placa: vehiculo.placa,
            valor_mercado: parseFloat(vehiculo.valor_mercado),
            tipo_vehiculo: vehiculo.tipo_vehiculo,
            uso_vehiculo: vehiculo.uso_vehiculo
        });
        setEditMode(true);
        setSelectedId(vehiculo.id_vehiculo);
        setShowDialog(true);
    };

    const handleSubmit = async () => {
        if (!formData.marca || !formData.modelo || !formData.placa) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor complete todos los campos obligatorios'
            });
            return;
        }

        const datos = {
            marca: formData.marca,
            modelo: formData.modelo,
            anio_fabricacion: formData.anio_fabricacion,
            placa: formData.placa,
            valor_mercado: formData.valor_mercado,
            tipo_vehiculo: formData.tipo_vehiculo,
            uso_vehiculo: formData.uso_vehiculo
        };

        let response;
        if (editMode && selectedId) {
            response = await vehiculoService.actualizar(selectedId, datos);
        } else {
            response = await vehiculoService.crear(datos);
        }

        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: editMode ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente'
            });
            setShowDialog(false);
            cargarVehiculos();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const confirmarEliminar = (vehiculo: Vehiculo) => {
        confirmDialog({
            message: `¿Está seguro de eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => handleEliminar(vehiculo.id_vehiculo)
        });
    };

    const handleEliminar = async (id: number) => {
        const response = await vehiculoService.eliminar(id);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Vehículo eliminado correctamente'
            });
            cargarVehiculos();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const antiguedadTemplate = (rowData: Vehiculo) => {
        if (rowData.antiguedad === undefined) return '-';

        const severity = rowData.antiguedad > 15 ? 'danger' : rowData.antiguedad > 10 ? 'warning' : 'success';
        return <Tag value={`${rowData.antiguedad} años`} severity={severity as any} />;
    };

    const valorTemplate = (rowData: Vehiculo) => {
        return `$${parseFloat(rowData.valor_mercado).toLocaleString()}`;
    };

    const cotizableTemplate = (rowData: Vehiculo) => {
        return rowData.puede_cotizar ? <Tag value="Sí" severity="success" icon="pi pi-check" /> : <Tag value="No" severity="danger" icon="pi pi-times" />;
    };

    const accionesTemplate = (rowData: Vehiculo) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded outlined severity="info" onClick={() => abrirDialogEditar(rowData)} tooltip="Editar" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarEliminar(rowData)} tooltip="Eliminar" />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h2 className="m-0">Gestión de Vehículos</h2>
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
                <Button label="Nuevo Vehículo" icon="pi pi-plus" onClick={abrirDialogNuevo} />
            </div>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="col-12">
                <Card>
                    <DataTable value={vehiculos} loading={loading} header={header} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="No se encontraron vehículos" className="p-datatable-sm">
                        <Column field="marca" header="Marca" sortable />
                        <Column field="modelo" header="Modelo" sortable />
                        <Column field="anio_fabricacion" header="Año" sortable />
                        <Column field="placa" header="Placa" sortable />
                        <Column field="tipo_vehiculo" header="Tipo" sortable />
                        <Column field="uso_vehiculo" header="Uso" sortable />
                        <Column field="valor_mercado" header="Valor" body={valorTemplate} sortable />
                        <Column field="antiguedad" header="Antigüedad" body={antiguedadTemplate} sortable />
                        <Column field="puede_cotizar" header="Cotizable" body={cotizableTemplate} />
                        <Column body={accionesTemplate} header="Acciones" style={{ width: '10rem' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog
                header={editMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                visible={showDialog}
                style={{ width: '700px' }}
                onHide={() => setShowDialog(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setShowDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} />
                    </div>
                }
            >
                <div className="grid p-fluid">
                    <div className="col-6">
                        <label htmlFor="marca">Marca *</label>
                        <InputText id="marca" value={formData.marca} onChange={(e) => setFormData({ ...formData, marca: e.target.value })} placeholder="Toyota, Chevrolet..." />
                    </div>

                    <div className="col-6">
                        <label htmlFor="modelo">Modelo *</label>
                        <InputText id="modelo" value={formData.modelo} onChange={(e) => setFormData({ ...formData, modelo: e.target.value })} placeholder="Corolla, Cruze..." />
                    </div>

                    <div className="col-6">
                        <label htmlFor="anio">Año de Fabricación *</label>
                        <InputNumber id="anio" value={formData.anio_fabricacion} onValueChange={(e) => setFormData({ ...formData, anio_fabricacion: e.value || new Date().getFullYear() })} min={1980} max={new Date().getFullYear()} />
                    </div>

                    <div className="col-6">
                        <label htmlFor="placa">Placa *</label>
                        <InputText id="placa" value={formData.placa} onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })} placeholder="ABC-123" />
                    </div>

                    <div className="col-6">
                        <label htmlFor="tipo">Tipo de Vehículo *</label>
                        <Dropdown id="tipo" value={formData.tipo_vehiculo} options={tiposVehiculo} onChange={(e) => setFormData({ ...formData, tipo_vehiculo: e.value })} />
                    </div>

                    <div className="col-6">
                        <label htmlFor="uso">Uso del Vehículo *</label>
                        <Dropdown id="uso" value={formData.uso_vehiculo} options={usoVehiculo} onChange={(e) => setFormData({ ...formData, uso_vehiculo: e.value })} />
                    </div>

                    <div className="col-12">
                        <label htmlFor="valor">Valor de Mercado ($) *</label>
                        <InputNumber id="valor" value={formData.valor_mercado} onValueChange={(e) => setFormData({ ...formData, valor_mercado: e.value || 0 })} mode="currency" currency="USD" locale="en-US" min={0} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
