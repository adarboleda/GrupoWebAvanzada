'use client';

import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { equipoService } from '@/services/equipoService';

interface EquipoTableProps {
    equipos: any[];
    loading: boolean;
    onEdit: (equipo: any) => void;
    onRefresh: () => void;
    globalFilter: string;
}

export default function EquipoTable({ equipos, loading, onEdit, onRefresh, globalFilter }: EquipoTableProps) {
    const toast = useRef<Toast>(null);

    const eliminarEquipo = async (id: number) => {
        confirmDialog({
            message: '¿Está seguro de eliminar este equipo?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: async () => {
                const response = await equipoService.eliminar(id);
                if (response.ok) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Equipo eliminado correctamente'
                    });
                    onRefresh();
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.error
                    });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => onEdit(rowData)} tooltip="Editar" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarEquipo(rowData.id_equipo)} tooltip="Eliminar" />
            </div>
        );
    };

    const jugadoresBodyTemplate = (rowData: any) => {
        const count = rowData.jugadores?.length || 0;
        return (
            <span>
                {count} jugador{count !== 1 ? 'es' : ''}
            </span>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable value={equipos} loading={loading} paginator rows={10} globalFilter={globalFilter} emptyMessage="No se encontraron equipos" className="p-datatable-gridlines">
                <Column field="id_equipo" header="ID" sortable style={{ width: '10%' }} />
                <Column field="nombre" header="Nombre del Equipo" sortable />
                <Column body={jugadoresBodyTemplate} header="Jugadores" style={{ width: '15%' }} />
                <Column body={actionBodyTemplate} header="Acciones" style={{ width: '15%' }} />
            </DataTable>
        </>
    );
}
