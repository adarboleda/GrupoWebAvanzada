'use client';

import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { jugadorService } from '@/services/jugadorService';

interface JugadorTableProps {
    jugadores: any[];
    loading: boolean;
    onEdit: (jugador: any) => void;
    onRefresh: () => void;
    globalFilter: string;
}

export default function JugadorTable({ jugadores, loading, onEdit, onRefresh, globalFilter }: JugadorTableProps) {
    const toast = useRef<Toast>(null);

    const eliminarJugador = async (id: number) => {
        confirmDialog({
            message: '¿Está seguro de eliminar este jugador?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: async () => {
                const response = await jugadorService.eliminar(id);
                if (response.ok) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Jugador eliminado correctamente'
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarJugador(rowData.id_jugador)} tooltip="Eliminar" />
            </div>
        );
    };

    const equipoBodyTemplate = (rowData: any) => {
        return rowData.equipo?.nombre || 'Sin equipo';
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable value={jugadores} loading={loading} paginator rows={10} globalFilter={globalFilter} emptyMessage="No se encontraron jugadores" className="p-datatable-gridlines">
                <Column field="id_jugador" header="ID" sortable style={{ width: '10%' }} />
                <Column field="nombre" header="Nombre del Jugador" sortable />
                <Column body={equipoBodyTemplate} header="Equipo" sortable />
                <Column body={actionBodyTemplate} header="Acciones" style={{ width: '15%' }} />
            </DataTable>
        </>
    );
}
