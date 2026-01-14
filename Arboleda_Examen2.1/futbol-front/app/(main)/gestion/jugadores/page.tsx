'use client';

import React, { useEffect, useState, useRef } from 'react';
import { jugadorService } from '@/services/jugadorService';
import { equipoService } from '@/services/equipoService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import JugadorForm from '@/components/JugadorForm';
import JugadorTable from '@/components/JugadorTable';

export default function JugadoresPage() {
    const toast = useRef<Toast>(null);
    const [jugadores, setJugadores] = useState([]);
    const [equipos, setEquipos] = useState<Array<{ label: string; value: number | null }>>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [jugadorEditar, setJugadorEditar] = useState(null);
    const [equipoFiltro, setEquipoFiltro] = useState(null);

    useEffect(() => {
        cargarEquipos();
        cargarJugadores();
    }, []);

    useEffect(() => {
        if (equipoFiltro) {
            cargarJugadoresPorEquipo(equipoFiltro);
        } else {
            cargarJugadores();
        }
    }, [equipoFiltro]);

    const cargarEquipos = async () => {
        const response = await equipoService.listar();
        if (response.ok) {
            const equiposOptions = [
                { label: 'Todos los equipos', value: null },
                ...response.data.map((equipo: any) => ({
                    label: equipo.nombre,
                    value: equipo.id_equipo
                }))
            ];
            setEquipos(equiposOptions);
        }
    };

    const cargarJugadores = async () => {
        setLoading(true);
        const response = await jugadorService.listar();
        if (response.ok) {
            setJugadores(response.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: response.error
            });
        }
        setLoading(false);
    };

    const cargarJugadoresPorEquipo = async (idEquipo: number) => {
        setLoading(true);
        const response = await jugadorService.listarPorEquipo(idEquipo);
        if (response.ok) {
            setJugadores(response.data);
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
        setJugadorEditar(null);
        setShowDialog(true);
    };

    const abrirDialogEditar = (jugador: any) => {
        setJugadorEditar(jugador);
        setShowDialog(true);
    };

    const cerrarDialog = () => {
        setShowDialog(false);
        setJugadorEditar(null);
    };

    const handleSuccess = () => {
        cerrarDialog();
        if (equipoFiltro) {
            cargarJugadoresPorEquipo(equipoFiltro);
        } else {
            cargarJugadores();
        }
    };

    const searchHeader = (
        <div className="flex flex-column md:flex-row gap-3 mb-3 mt-3">
            <span className="p-input-icon-left flex-1">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar jugadores..." className="w-full" />
            </span>
            <Dropdown value={equipoFiltro} options={equipos} onChange={(e) => setEquipoFiltro(e.value)} placeholder="Filtrar por equipo" className="w-full md:w-auto" style={{ minWidth: '200px' }} />
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
                            <h2 className="m-0 text-2xl font-bold text-900">Gestión de Jugadores</h2>
                            <Button label="Nuevo Jugador" icon="pi pi-plus" onClick={abrirDialogNuevo} className="p-button-primary" />
                        </div>
                    </div>
                    {searchHeader}
                    <JugadorTable jugadores={jugadores} loading={loading} onEdit={abrirDialogEditar} onRefresh={equipoFiltro ? () => cargarJugadoresPorEquipo(equipoFiltro) : cargarJugadores} globalFilter={globalFilter} />
                </Card>
            </div>

            <Dialog visible={showDialog} style={{ width: '450px' }} header={jugadorEditar ? 'Editar Jugador' : 'Nuevo Jugador'} modal className="p-fluid" onHide={cerrarDialog}>
                <JugadorForm onSuccess={handleSuccess} jugadorEditar={jugadorEditar} onCancel={cerrarDialog} />
            </Dialog>
        </div>
    );
}
