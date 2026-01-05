"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import EquipoForm from "@/demo/components/EquipoForm";
import EquipoTable from "@/demo/components/EquipoTable";
import { EquipoService } from "@/demo/service/equipoService";

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipoDialog, setEquipoDialog] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [detalleDialog, setDetalleDialog] = useState(false);
  const toast = useRef(null);
  const equipoService = new EquipoService();

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      setLoading(true);
      const data = await equipoService.obtenerEquipos();
      setEquipos(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los equipos",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirNuevo = () => {
    setEquipoSeleccionado(null);
    setEquipoDialog(true);
  };

  const editarEquipo = (equipo) => {
    setEquipoSeleccionado({ ...equipo });
    setEquipoDialog(true);
  };

  const verDetalles = (equipo) => {
    setEquipoSeleccionado(equipo);
    setDetalleDialog(true);
  };

  const guardarEquipo = async (equipo) => {
    try {
      if (equipo.id) {
        await equipoService.actualizarEquipo(equipo.id, equipo);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Equipo actualizado correctamente",
          life: 3000,
        });
      } else {
        await equipoService.crearEquipo(equipo);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Equipo creado correctamente",
          life: 3000,
        });
      }
      setEquipoDialog(false);
      cargarEquipos();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al guardar el equipo",
        life: 3000,
      });
    }
  };

  const confirmarEliminacion = (equipo) => {
    confirmDialog({
      message: `¿Está seguro de eliminar el equipo "${equipo.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => eliminarEquipo(equipo),
    });
  };

  const eliminarEquipo = async (equipo) => {
    try {
      await equipoService.eliminarEquipo(equipo.id);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Equipo eliminado correctamente",
        life: 3000,
      });
      cargarEquipos();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al eliminar el equipo",
        life: 3000,
      });
    }
  };

  const detalleDialogFooter = (
    <Button label="Cerrar" icon="pi pi-times" onClick={() => setDetalleDialog(false)} />
  );

  return (
    <div className="grid">
      <div className="col-12">
        <Toast ref={toast} />
        <ConfirmDialog />

        <Card
          title="Gestión de Equipos"
          subTitle="Administre los equipos registrados en el sistema"
        >
          <div className="flex justify-content-between mb-3">
            <Button
              label="Nuevo Equipo"
              icon="pi pi-plus"
              severity="success"
              onClick={abrirNuevo}
            />
            <Button
              label="Actualizar"
              icon="pi pi-refresh"
              severity="info"
              onClick={cargarEquipos}
            />
          </div>

          <EquipoTable
            equipos={equipos}
            onEdit={editarEquipo}
            onDelete={confirmarEliminacion}
            onView={verDetalles}
            loading={loading}
          />
        </Card>

        <EquipoForm
          visible={equipoDialog}
          equipo={equipoSeleccionado}
          onHide={() => setEquipoDialog(false)}
          onSave={guardarEquipo}
        />

        {/* Dialog de Detalles */}
        <Dialog
          visible={detalleDialog}
          style={{ width: "600px" }}
          header="Detalles del Equipo"
          modal
          footer={detalleDialogFooter}
          onHide={() => setDetalleDialog(false)}
        >
          {equipoSeleccionado && (
            <div className="grid">
              {equipoSeleccionado.escudo && (
                <div className="col-12 text-center">
                  <img
                    src={equipoSeleccionado.escudo}
                    alt={equipoSeleccionado.nombre}
                    style={{ maxWidth: "150px" }}
                  />
                </div>
              )}
              <div className="col-12">
                <h3>{equipoSeleccionado.nombre}</h3>
              </div>
              <div className="col-6">
                <strong>Ciudad:</strong>
              </div>
              <div className="col-6">{equipoSeleccionado.ciudad}</div>
              <div className="col-6">
                <strong>Estadio:</strong>
              </div>
              <div className="col-6">{equipoSeleccionado.estadio || "-"}</div>
              <div className="col-6">
                <strong>Fundación:</strong>
              </div>
              <div className="col-6">{equipoSeleccionado.fundacion || "-"}</div>
              <div className="col-6">
                <strong>Entrenador:</strong>
              </div>
              <div className="col-6">{equipoSeleccionado.entrenador || "-"}</div>
              <div className="col-6">
                <strong>Jugadores:</strong>
              </div>
              <div className="col-6">{equipoSeleccionado.jugadores?.length || 0}</div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
}
