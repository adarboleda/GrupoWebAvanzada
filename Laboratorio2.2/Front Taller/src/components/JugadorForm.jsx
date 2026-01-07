'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import jugadorService from '../services/jugadorService';
import equipoService from '../services/equipoService';

export default function JugadorForm({ visible, onHide, onSave, jugadorEditar = null }) {
  const [formData, setFormData] = useState({ nombre: '', posicion: '', numero: '', equipoId: '' });
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = React.useRef(null);

  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
    if (jugadorEditar) {
      setFormData(jugadorEditar);
    } else {
      setFormData({ nombre: '', posicion: '', numero: '', equipoId: '' });
    }
  }, [jugadorEditar, visible]);

  const cargarEquipos = async () => {
    const result = await equipoService.obtenerTodos();
    if (result.ok) {
      setEquipos(result.data.map((e) => ({ label: e.nombre, value: e.id })));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e) => {
    setFormData((prev) => ({ ...prev, equipoId: e.value }));
  };

  const handleNumberChange = (e) => {
    setFormData((prev) => ({ ...prev, numero: e.value }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.posicion || !formData.numero || !formData.equipoId) {
      toastRef.current?.show({ severity: 'warn', summary: 'Validación', detail: 'Completa todos los campos' });
      return;
    }

    setLoading(true);
    let result;

    if (jugadorEditar?.id) {
      result = await jugadorService.actualizar(jugadorEditar.id, formData);
    } else {
      result = await jugadorService.crear(formData);
    }

    setLoading(false);

    if (result.ok) {
      toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Jugador guardado correctamente' });
      onSave();
      onHide();
    } else {
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: result.error });
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog visible={visible} onHide={onHide} header={jugadorEditar?.id ? 'Editar Jugador' : 'Nuevo Jugador'} modal className="p-fluid">
        <div className="field mb-3">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>
        <div className="field mb-3">
          <label htmlFor="posicion">Posición</label>
          <InputText id="posicion" name="posicion" value={formData.posicion} onChange={handleChange} />
        </div>
        <div className="field mb-3">
          <label htmlFor="numero">Número de Camiseta</label>
          <InputNumber id="numero" value={formData.numero} onValueChange={handleNumberChange} />
        </div>
        <div className="field mb-3">
          <label htmlFor="equipoId">Equipo</label>
          <Dropdown id="equipoId" value={formData.equipoId} options={equipos} onChange={handleDropdownChange} placeholder="Selecciona un equipo" />
        </div>
        <div className="flex gap-2 justify-content-end">
          <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-secondary" />
          <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} loading={loading} />
        </div>
      </Dialog>
    </>
  );
}
