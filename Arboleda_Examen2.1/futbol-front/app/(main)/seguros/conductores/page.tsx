'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { conductorService } from '@/services/apiService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';

interface Conductor {
    id_conductor: number;
    identificacion: string;
    nombre_completo: string;
    fecha_nacimiento: string;
    email: string;
    numero_accidentes: number;
    edad_calculada?: number;
    createdAt: string;
}

interface FormData {
    identificacion: string;
    nombre_completo: string;
    fecha_nacimiento: Date | null;
    email: string;
    numero_accidentes: number;
}

export default function ConductoresPage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState<FormData>({
        identificacion: '',
        nombre_completo: '',
        fecha_nacimiento: null,
        email: '',
        numero_accidentes: 0
    });

    useEffect(() => {
        cargarConductores();
    }, []);

    const cargarConductores = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    const abrirDialogNuevo = () => {
        setFormData({
            identificacion: '',
            nombre_completo: '',
            fecha_nacimiento: null,
            email: '',
            numero_accidentes: 0
        });
        setEditMode(false);
        setSelectedId(null);
        setShowDialog(true);
    };

    const abrirDialogEditar = (conductor: Conductor) => {
        setFormData({
            identificacion: conductor.identificacion,
            nombre_completo: conductor.nombre_completo,
            fecha_nacimiento: new Date(conductor.fecha_nacimiento),
            email: conductor.email,
            numero_accidentes: conductor.numero_accidentes
        });
        setEditMode(true);
        setSelectedId(conductor.id_conductor);
        setShowDialog(true);
    };

    const handleSubmit = async () => {
        if (!formData.identificacion || !formData.nombre_completo || !formData.fecha_nacimiento || !formData.email) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor complete todos los campos obligatorios'
            });
            return;
        }

        const datos = {
            identificacion: formData.identificacion,
            nombre_completo: formData.nombre_completo,
            fecha_nacimiento: formData.fecha_nacimiento.toISOString().split('T')[0],
            email: formData.email,
            numero_accidentes: formData.numero_accidentes
        };

        let response;
        if (editMode && selectedId) {
            response = await conductorService.actualizar(selectedId, datos);
        } else {
            response = await conductorService.crear(datos);
        }

        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: editMode ? 'Conductor actualizado correctamente' : 'Conductor creado correctamente'
            });
            setShowDialog(false);
            cargarConductores();
        } else {
            // Detectar si es error de identificación duplicada
            let errorDetail = response.error;
            if (response.error && (response.error.includes('Duplicate') || response.error.includes('identificacion'))) {
                errorDetail = `La identificación ${formData.identificacion} ya está registrada en el sistema. Por favor, use una identificación diferente.`;
            }
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 5000
            });
        }
    };

    const confirmarEliminar = (conductor: Conductor) => {
        confirmDialog({
            message: `¿Está seguro de eliminar al conductor ${conductor.nombre_completo}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => handleEliminar(conductor.id_conductor)
        });
    };

    const handleEliminar = async (id: number) => {
        const response = await conductorService.eliminar(id);
        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Conductor eliminado correctamente'
            });
            cargarConductores();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
    };

    const edadTemplate = (rowData: Conductor) => {
        return rowData.edad_calculada ? `${rowData.edad_calculada} años` : '-';
    };

    const accidentesTemplate = (rowData: Conductor) => {
        const severity = rowData.numero_accidentes === 0 ? 'success' : rowData.numero_accidentes > 3 ? 'danger' : 'warning';
        return <Tag value={rowData.numero_accidentes} severity={severity as any} />;
    };

    const accionesTemplate = (rowData: Conductor) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded outlined severity="info" onClick={() => abrirDialogEditar(rowData)} tooltip="Editar" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarEliminar(rowData)} tooltip="Eliminar" />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h2 className="m-0">Gestión de Conductores</h2>
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
                <Button label="Nuevo Conductor" icon="pi pi-plus" onClick={abrirDialogNuevo} />
            </div>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="col-12">
                <Card>
                    <DataTable value={conductores} loading={loading} header={header} globalFilter={globalFilter} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="No se encontraron conductores" className="p-datatable-sm">
                        <Column field="identificacion" header="Identificación" sortable />
                        <Column field="nombre_completo" header="Nombre Completo" sortable />
                        <Column field="edad_calculada" header="Edad" body={edadTemplate} sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="numero_accidentes" header="Accidentes" body={accidentesTemplate} sortable />
                        <Column body={accionesTemplate} header="Acciones" style={{ width: '10rem' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog
                header={editMode ? 'Editar Conductor' : 'Nuevo Conductor'}
                visible={showDialog}
                style={{ width: '600px' }}
                onHide={() => setShowDialog(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setShowDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} />
                    </div>
                }
            >
                <div className="grid p-fluid">
                    <div className="col-12">
                        <label htmlFor="identificacion">Identificación *</label>
                        <InputText id="identificacion" value={formData.identificacion} onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })} placeholder="Ingrese la identificación" />
                    </div>

                    <div className="col-12">
                        <label htmlFor="nombre">Nombre Completo *</label>
                        <InputText id="nombre" value={formData.nombre_completo} onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })} placeholder="Ingrese el nombre completo" />
                    </div>

                    <div className="col-12">
                        <label htmlFor="fecha">Fecha de Nacimiento *</label>
                        <Calendar
                            id="fecha"
                            value={formData.fecha_nacimiento}
                            onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.value as Date })}
                            dateFormat="yy-mm-dd"
                            showIcon
                            maxDate={new Date()}
                            yearNavigator
                            yearRange="1940:2010"
                        />
                    </div>

                    <div className="col-12">
                        <label htmlFor="email">Email *</label>
                        <InputText id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="correo@ejemplo.com" />
                    </div>

                    <div className="col-12">
                        <label htmlFor="accidentes">Número de Accidentes</label>
                        <InputNumber id="accidentes" value={formData.numero_accidentes} onValueChange={(e) => setFormData({ ...formData, numero_accidentes: e.value || 0 })} min={0} max={99} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
