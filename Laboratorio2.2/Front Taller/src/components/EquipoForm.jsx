'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import equipoService from '../services/equipoService';

export default function EquipoForm({ visible, onHide, onSave, equipoEditar = null }) {
  const [formData, setFormData] = useState({ nombre: '', ciudad: '' });
  const [loading, setLoading] = useState(false);
  const toastRef = React.useRef(null);

  useEffect(() => {
    if (equipoEditar) {
      setFormData(equipoEditar);
    } else {
      setFormData({ nombre: '', ciudad: '' });
    }
  }, [equipoEditar, visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.ciudad) {
      toastRef.current?.show({ severity: 'warn', summary: 'Validación', detail: 'Completa todos los campos' });
      return;
    }

    setLoading(true);
    let result;

    if (equipoEditar?.id) {
      result = await equipoService.actualizar(equipoEditar.id, formData);
    } else {
      result = await equipoService.crear(formData);
    }

    setLoading(false);

    if (result.ok) {
      toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Equipo guardado correctamente' });
      onSave();
      onHide();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: result.error });
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog visible={visible} onHide={onHide} header={equipoEditar?.id ? 'Editar Equipo' : 'Nuevo Equipo'} modal className="p-fluid">
        <div className="field mb-3">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div className="field mb-3">
          <label htmlFor="ciudad">Ciudad</label>
          <InputText id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} />
        </div>
        <div className="flex gap-2 justify-content-end">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-secondary" />
          <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} loading={loading} />
        </div>
      </Dialog>
    </>
  );
}
