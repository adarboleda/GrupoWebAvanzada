'use client';

import React, { useEffect, useState, useRef } from 'react';
import { equipoService } from '@/services/equipoService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import EquipoForm from '@/components/EquipoForm';
import EquipoTable from '@/components/EquipoTable';

export default function EquiposPage() {
    const toast = useRef<Toast>(null);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [equipoEditar, setEquipoEditar] = useState(null);

    useEffect(() => {
        cargarEquipos();
    }, []);

    const cargarEquipos = async () => {
        setLoading(true);
        const response = await equipoService.listar();
        if (response.ok) {
            setEquipos(response.data);
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
        setEquipoEditar(null);
        setShowDialog(true);
    };

    const abrirDialogEditar = (equipo: any) => {
        setEquipoEditar(equipo);
        setShowDialog(true);
    };

    const cerrarDialog = () => {
        setShowDialog(false);
        setEquipoEditar(null);
    };

    const handleSuccess = () => {
        cerrarDialog();
        cargarEquipos();
    };

    const searchHeader = (
        <div className="flex justify-content-between align-items-center mb-3 mt-3">
            <span className="p-input-icon-left w-full md:w-auto">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar equipos..." className="w-full" />
            </span>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="col-12">
                <Card className="shadow-2">
                    <div className="mb-4">
                        <div className="flex justify-content-between align-items-center">
                            <h2 className="m-0 text-2xl font-bold text-900">Gestión de Equipos</h2>
                            <Button label="Nuevo Equipo" icon="pi pi-plus" onClick={abrirDialogNuevo} className="p-button-primary" />
                        </div>
                    </div>
                    {searchHeader}
                    <EquipoTable equipos={equipos} loading={loading} onEdit={abrirDialogEditar} onRefresh={cargarEquipos} globalFilter={globalFilter} />
                </Card>
            </div>

            <Dialog visible={showDialog} style={{ width: '450px' }} header={equipoEditar ? 'Editar Equipo' : 'Nuevo Equipo'} modal className="p-fluid" onHide={cerrarDialog}>
                <EquipoForm onSuccess={handleSuccess} equipoEditar={equipoEditar} onCancel={cerrarDialog} />
            </Dialog>
        </div>
    );
}
