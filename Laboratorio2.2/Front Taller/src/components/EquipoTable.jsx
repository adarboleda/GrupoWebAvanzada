'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import equipoService from '../services/equipoService';

export default function EquipoTable({ refresh, onEdit }) {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toastRef = React.useRef(null);

  useEffect(() => {
    cargarEquipos();
  }, [refresh]);

  const cargarEquipos = async () => {
    setLoading(true);
    const result = await equipoService.obtenerTodos();
    if (result.ok) {
      setEquipos(result.data);
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: result.error });
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: '¿Está seguro de que desea eliminar este equipo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const result = await equipoService.eliminar(id);
        if (result.ok) {
          toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Equipo eliminado' });
          cargarEquipos();
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
      <DataTable value={equipos} loading={loading} responsiveLayout="scroll" paginator rows={10}>
        <Column field="id" header="ID" />
        <Column field="nombre" header="Nombre" />
        <Column field="ciudad" header="Ciudad" />
        <Column body={actionTemplate} header="Acciones" style={{ width: '10rem' }} />
      </DataTable>
    </>
  );
}
