'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import jugadorService from '../services/jugadorService';

export default function JugadorTable({ refresh, equipoIdFiltro, onEdit }) {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const toastRef = React.useRef(null);

  useEffect(() => {
    cargarJugadores();
  }, [refresh, equipoIdFiltro]);

  const cargarJugadores = async () => {
    setLoading(true);
    let result;
    if (equipoIdFiltro) {
      result = await jugadorService.obtenerPorEquipo(equipoIdFiltro);
    } else {
      result = await jugadorService.obtenerTodos();
    }
    
    if (result.ok) {
      setJugadores(result.data);
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: result.error });
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: '¿Está seguro de que desea eliminar este jugador?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const result = await jugadorService.eliminar(id);
        if (result.ok) {
          toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Jugador eliminado' });
          cargarJugadores();
        } else {
          toastRef.current?.show({ severity: 'error', summary: 'Error', detail: result.error });
        }
      }
    });
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded onClick={() => onEdit(rowData)} className="p-button-rounded p-button-success p-button-sm" />
      <Button icon="pi pi-trash" rounded onClick={() => handleDelete(rowData.id)} className="p-button-rounded p-button-danger p-button-sm" />
    </div>
  );

  return (
    <>
      <Toast ref={toastRef} />
      <ConfirmDialog />
      <DataTable value={jugadores} loading={loading} responsiveLayout="scroll" paginator rows={10}>
        <Column field="id" header="ID" />
        <Column field="nombre" header="Nombre" />
        <Column field="posicion" header="Posición" />
        <Column field="numero" header="Número" />
        <Column field="equipoId" header="ID Equipo" />
        <Column body={actionTemplate} header="Acciones" style={{ width: '10rem' }} />
      </DataTable>
    </>
  );
}
