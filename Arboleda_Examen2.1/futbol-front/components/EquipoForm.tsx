'use client';

import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { equipoService } from '@/services/equipoService';

interface EquipoFormProps {
    onSuccess: () => void;
    equipoEditar?: any;
    onCancel?: () => void;
}

export default function EquipoForm({ onSuccess, equipoEditar, onCancel }: EquipoFormProps) {
    const toast = useRef<Toast>(null);
    const [nombre, setNombre] = useState(equipoEditar?.nombre || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El nombre del equipo es obligatorio'
            });
            return;
        }

        setLoading(true);

        let response;
        if (equipoEditar) {
            response = await equipoService.actualizar(equipoEditar.id_equipo, nombre);
        } else {
            response = await equipoService.crear(nombre);
        }

        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: equipoEditar ? 'Equipo actualizado correctamente' : 'Equipo creado correctamente'
            });
            setNombre('');
            onSuccess();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }

        setLoading(false);
    };

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="field">
                    <label htmlFor="nombre">Nombre del Equipo</label>
                    <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrese el nombre del equipo" required />
                </div>

                <div className="flex gap-2 justify-content-end mt-3">
                    {onCancel && <Button label="Cancelar" icon="pi pi-times" onClick={onCancel} className="p-button-secondary" type="button" />}
                    <Button label={equipoEditar ? 'Actualizar' : 'Guardar'} icon="pi pi-check" loading={loading} type="submit" />
                </div>
            </form>
        </>
    );
}
