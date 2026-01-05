"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import JugadorForm from "@/demo/components/JugadorForm";
import JugadorTable from "@/demo/components/JugadorTable";
import { JugadorService } from "@/demo/service/jugadorService";
import { EquipoService } from "@/demo/service/equipoService";

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jugadorDialog, setJugadorDialog] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [equipoFiltro, setEquipoFiltro] = useState(null);
  const toast = useRef(null);
  const jugadorService = new JugadorService();
  const equipoService = new EquipoService();

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (equipoFiltro) {
      filtrarPorEquipo(equipoFiltro);
    } else {
      cargarJugadores();
    }
  }, [equipoFiltro]);

  const cargarDatos = async () => {
    await Promise.all([cargarJugadores(), cargarEquipos()]);
  };

  const cargarJugadores = async () => {
    try {
      setLoading(true);
      const data = await jugadorService.obtenerJugadores();
      setJugadores(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los jugadores",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarEquipos = async () => {
    try {
      const data = await equipoService.obtenerEquipos();
      setEquipos(data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    }
  };

  const filtrarPorEquipo = async (equipoId) => {
    try {
      setLoading(true);
      const data = await jugadorService.obtenerJugadoresPorEquipo(equipoId);
      setJugadores(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los jugadores del equipo",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirNuevo = () => {
    setJugadorSeleccionado(null);
    setJugadorDialog(true);
  };

  const editarJugador = (jugador) => {
    setJugadorSeleccionado({ ...jugador });
    setJugadorDialog(true);
  };

  const guardarJugador = async (jugador) => {
    try {
      if (jugador.id) {
        await jugadorService.actualizarJugador(jugador.id, jugador);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Jugador actualizado correctamente",
          life: 3000,
        });
      } else {
        await jugadorService.crearJugador(jugador);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Jugador creado correctamente",
          life: 3000,
        });
      }
      setJugadorDialog(false);
      if (equipoFiltro) {
        filtrarPorEquipo(equipoFiltro);
      } else {
        cargarJugadores();
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al guardar el jugador",
        life: 3000,
      });
    }
  };

  const confirmarEliminacion = (jugador) => {
    confirmDialog({
      message: `¿Está seguro de eliminar al jugador "${jugador.nombre} ${jugador.apellido}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => eliminarJugador(jugador),
    });
  };

  const eliminarJugador = async (jugador) => {
    try {
      await jugadorService.eliminarJugador(jugador.id);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Jugador eliminado correctamente",
        life: 3000,
      });
      if (equipoFiltro) {
        filtrarPorEquipo(equipoFiltro);
      } else {
        cargarJugadores();
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al eliminar el jugador",
        life: 3000,
      });
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Toast ref={toast} />
        <ConfirmDialog />

        <Card
          title="Gestión de Jugadores"
          subTitle="Administre los jugadores registrados en el sistema"
        >
          <div className="flex justify-content-between mb-3">
            <div className="flex gap-2">
              <Button
                label="Nuevo Jugador"
                icon="pi pi-plus"
                severity="success"
                onClick={abrirNuevo}
              />
              <Button
                label="Actualizar"
                icon="pi pi-refresh"
                severity="info"
                onClick={() => {
                  if (equipoFiltro) {
                    filtrarPorEquipo(equipoFiltro);
                  } else {
                    cargarJugadores();
                  }
                }}
              />
            </div>

            <div className="flex align-items-center gap-2">
              <label htmlFor="filtroEquipo" className="font-bold">
                Filtrar por equipo:
              </label>
              <Dropdown
                id="filtroEquipo"
                value={equipoFiltro}
                options={equipos}
                onChange={(e) => setEquipoFiltro(e.value)}
                optionLabel="nombre"
                optionValue="id"
                placeholder="Todos los equipos"
                showClear
                style={{ width: "250px" }}
              />
            </div>
          </div>

          <JugadorTable
            jugadores={jugadores}
            onEdit={editarJugador}
            onDelete={confirmarEliminacion}
            loading={loading}
          />
        </Card>

        <JugadorForm
          visible={jugadorDialog}
          jugador={jugadorSeleccionado}
          equipos={equipos}
          onHide={() => setJugadorDialog(false)}
          onSave={guardarJugador}
        />
      </div>
    </div>
  );
}
