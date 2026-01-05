"use client";
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function EquipoTable({ equipos, onEdit, onDelete, onView, loading }) {
  const escudoBodyTemplate = (rowData) => {
    return rowData.escudo ? (
      <img
        src={rowData.escudo}
        alt={rowData.nombre}
        className="w-3rem h-3rem border-circle"
        onError={(e) => {
          e.target.src = "/demo/images/avatar/default-team.png";
        }}
      />
    ) : (
      <i className="pi pi-image text-4xl text-300"></i>
    );
  };

  const estadoBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.activo ? "Activo" : "Inactivo"}
        severity={rowData.activo ? "success" : "danger"}
      />
    );
  };

  const jugadoresBodyTemplate = (rowData) => {
    const cantidad = rowData.jugadores?.length || 0;
    return (
      <span>
        <i className="pi pi-users mr-2"></i>
        {cantidad} {cantidad === 1 ? "jugador" : "jugadores"}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          onClick={() => onView(rowData)}
          tooltip="Ver detalles"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => onEdit(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => onDelete(rowData)}
          tooltip="Eliminar"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={equipos}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      dataKey="id"
      emptyMessage="No se encontraron equipos"
      className="datatable-responsive"
      responsiveLayout="scroll"
    >
      <Column
        field="escudo"
        header="Escudo"
        body={escudoBodyTemplate}
        style={{ width: "5rem" }}
      />
      <Column field="nombre" header="Nombre" sortable />
      <Column field="ciudad" header="Ciudad" sortable />
      <Column field="estadio" header="Estadio" sortable />
      <Column field="fundacion" header="Fundación" sortable />
      <Column field="entrenador" header="Entrenador" sortable />
      <Column
        field="jugadores"
        header="Jugadores"
        body={jugadoresBodyTemplate}
        sortable
      />
      <Column
        field="activo"
        header="Estado"
        body={estadoBodyTemplate}
        sortable
        style={{ width: "8rem" }}
      />
      <Column
        body={actionBodyTemplate}
        exportable={false}
        style={{ width: "12rem" }}
      />
    </DataTable>
  );
}
