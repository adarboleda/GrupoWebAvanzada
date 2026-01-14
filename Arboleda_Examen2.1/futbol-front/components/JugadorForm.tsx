'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { jugadorService } from '@/services/jugadorService';
import { equipoService } from '@/services/equipoService';

interface JugadorFormProps {
    onSuccess: () => void;
    jugadorEditar?: any;
    onCancel?: () => void;
}

export default function JugadorForm({ onSuccess, jugadorEditar, onCancel }: JugadorFormProps) {
    const toast = useRef<Toast>(null);
    const [nombre, setNombre] = useState(jugadorEditar?.nombre || '');
    const [idEquipo, setIdEquipo] = useState(jugadorEditar?.id_equipo || null);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarEquipos();
    }, []);

    const cargarEquipos = async () => {
        const response = await equipoService.listar();
        if (response.ok) {
            const equiposOptions = response.data.map((equipo: any) => ({
                label: equipo.nombre,
                value: equipo.id_equipo
            }));
            setEquipos(equiposOptions);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El nombre del jugador es obligatorio'
            });
            return;
        }

        if (!idEquipo) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar un equipo'
            });
            return;
        }

        setLoading(true);

        let response;
        if (jugadorEditar) {
            response = await jugadorService.actualizar(jugadorEditar.id_jugador, nombre, idEquipo);
        } else {
            response = await jugadorService.crear(nombre, idEquipo);
        }

        if (response.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: jugadorEditar ? 'Jugador actualizado correctamente' : 'Jugador creado correctamente'
            });
            setNombre('');
            setIdEquipo(null);
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
                    <label htmlFor="nombre">Nombre del Jugador</label>
                    <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrese el nombre del jugador" required />
                </div>

                <div className="field">
                    <label htmlFor="equipo">Equipo</label>
                    <Dropdown id="equipo" value={idEquipo} options={equipos} onChange={(e) => setIdEquipo(e.value)} placeholder="Seleccione un equipo" required />
                </div>

                <div className="flex gap-2 justify-content-end mt-3">
                    {onCancel && <Button label="Cancelar" icon="pi pi-times" onClick={onCancel} className="p-button-secondary" type="button" />}
                    <Button label={jugadorEditar ? 'Actualizar' : 'Guardar'} icon="pi pi-check" loading={loading} type="submit" />
                </div>
            </form>
        </>
    );
}
