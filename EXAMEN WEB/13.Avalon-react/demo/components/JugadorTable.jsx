"use client";
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function JugadorTable({ jugadores, onEdit, onDelete, loading }) {
  const fotoBodyTemplate = (rowData) => {
    return rowData.foto ? (
      <img
        src={rowData.foto}
        alt={`${rowData.nombre} ${rowData.apellido}`}
        className="w-3rem h-3rem border-circle"
        onError={(e) => {
          e.target.src = "/demo/images/avatar/default-player.png";
        }}
      />
    ) : (
      <i className="pi pi-user text-4xl text-300"></i>
    );
  };

  const nombreCompletoBodyTemplate = (rowData) => {
    return `${rowData.nombre} ${rowData.apellido}`;
  };

  const equipoBodyTemplate = (rowData) => {
    return rowData.equipo ? (
      <div className="flex align-items-center gap-2">
        {rowData.equipo.escudo && (
          <img
            src={rowData.equipo.escudo}
            alt={rowData.equipo.nombre}
            className="w-2rem h-2rem"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        <span>{rowData.equipo.nombre}</span>
      </div>
    ) : (
      "-"
    );
  };

  const posicionBodyTemplate = (rowData) => {
    const getSeverity = (posicion) => {
      switch (posicion) {
        case "portero":
          return "warning";
        case "defensa":
          return "info";
        case "mediocampista":
          return "success";
        case "delantero":
          return "danger";
        default:
          return null;
      }
    };

    return <Tag value={rowData.posicion?.toUpperCase()} severity={getSeverity(rowData.posicion)} />;
  };

  const estadoBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.activo ? "Activo" : "Inactivo"}
        severity={rowData.activo ? "success" : "danger"}
      />
    );
  };

  const edadBodyTemplate = (rowData) => {
    if (!rowData.fechaNacimiento) return "-";

    const hoy = new Date();
    const nacimiento = new Date(rowData.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return `${edad} años`;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
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
      value={jugadores}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      dataKey="id"
      emptyMessage="No se encontraron jugadores"
      className="datatable-responsive"
      responsiveLayout="scroll"
    >
      <Column field="foto" header="Foto" body={fotoBodyTemplate} style={{ width: "5rem" }} />
      <Column
        field="nombre"
        header="Nombre Completo"
        body={nombreCompletoBodyTemplate}
        sortable
      />
      <Column field="equipo" header="Equipo" body={equipoBodyTemplate} sortable />
      <Column field="posicion" header="Posición" body={posicionBodyTemplate} sortable />
      <Column
        field="numeroCamiseta"
        header="Número"
        sortable
        style={{ width: "6rem", textAlign: "center" }}
      />
      <Column field="nacionalidad" header="Nacionalidad" sortable />
      <Column field="fechaNacimiento" header="Edad" body={edadBodyTemplate} sortable />
      <Column
        field="activo"
        header="Estado"
        body={estadoBodyTemplate}
        sortable
        style={{ width: "8rem" }}
      />
      <Column body={actionBodyTemplate} exportable={false} style={{ width: "10rem" }} />
    </DataTable>
  );
}
