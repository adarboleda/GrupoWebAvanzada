"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export default function JugadorForm({ visible, jugador, equipos, onHide, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: null,
    nacionalidad: "",
    posicion: "",
    numeroCamiseta: null,
    foto: "",
    equipoId: null,
    activo: true,
  });

  const [errors, setErrors] = useState({});

  const posiciones = [
    { label: "Portero", value: "portero" },
    { label: "Defensa", value: "defensa" },
    { label: "Mediocampista", value: "mediocampista" },
    { label: "Delantero", value: "delantero" },
  ];

  useEffect(() => {
    if (jugador) {
      setFormData({
        ...jugador,
        fechaNacimiento: jugador.fechaNacimiento ? new Date(jugador.fechaNacimiento) : null,
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        fechaNacimiento: null,
        nacionalidad: "",
        posicion: "",
        numeroCamiseta: null,
        foto: "",
        equipoId: null,
        activo: true,
      });
    }
    setErrors({});
  }, [jugador, visible]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim() === "") {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido || formData.apellido.trim() === "") {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (!formData.posicion) {
      newErrors.posicion = "La posición es obligatoria";
    }

    if (!formData.equipoId) {
      newErrors.equipoId = "El equipo es obligatorio";
    }

    if (formData.numeroCamiseta && (formData.numeroCamiseta < 1 || formData.numeroCamiseta > 99)) {
      newErrors.numeroCamiseta = "El número debe estar entre 1 y 99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento
          ? formData.fechaNacimiento.toISOString().split("T")[0]
          : null,
      };
      onSave(dataToSave);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const dialogFooter = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} autoFocus />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "600px" }}
      header={jugador?.id ? "Editar Jugador" : "Nuevo Jugador"}
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={onHide}
    >
      <div className="grid">
        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="nombre" className="font-bold">
              Nombre *
            </label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className={errors.nombre ? "p-invalid" : ""}
            />
            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="apellido" className="font-bold">
              Apellido *
            </label>
            <InputText
              id="apellido"
              value={formData.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              className={errors.apellido ? "p-invalid" : ""}
            />
            {errors.apellido && <small className="p-error">{errors.apellido}</small>}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="fechaNacimiento" className="font-bold">
              Fecha de Nacimiento
            </label>
            <Calendar
              id="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={(e) => handleChange("fechaNacimiento", e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="nacionalidad" className="font-bold">
              Nacionalidad
            </label>
            <InputText
              id="nacionalidad"
              value={formData.nacionalidad || ""}
              onChange={(e) => handleChange("nacionalidad", e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="posicion" className="font-bold">
              Posición *
            </label>
            <Dropdown
              id="posicion"
              value={formData.posicion}
              options={posiciones}
              onChange={(e) => handleChange("posicion", e.value)}
              placeholder="Seleccione una posición"
              className={errors.posicion ? "p-invalid" : ""}
            />
            {errors.posicion && <small className="p-error">{errors.posicion}</small>}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <label htmlFor="numeroCamiseta" className="font-bold">
              Número de Camiseta
            </label>
            <InputNumber
              id="numeroCamiseta"
              value={formData.numeroCamiseta}
              onValueChange={(e) => handleChange("numeroCamiseta", e.value)}
              min={1}
              max={99}
              useGrouping={false}
              className={errors.numeroCamiseta ? "p-invalid" : ""}
            />
            {errors.numeroCamiseta && <small className="p-error">{errors.numeroCamiseta}</small>}
          </div>
        </div>

        <div className="col-12">
          <div className="field">
            <label htmlFor="equipoId" className="font-bold">
              Equipo *
            </label>
            <Dropdown
              id="equipoId"
              value={formData.equipoId}
              options={equipos}
              onChange={(e) => handleChange("equipoId", e.value)}
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione un equipo"
              className={errors.equipoId ? "p-invalid" : ""}
            />
            {errors.equipoId && <small className="p-error">{errors.equipoId}</small>}
          </div>
        </div>

        <div className="col-12">
          <div className="field">
            <label htmlFor="foto" className="font-bold">
              URL de la Foto
            </label>
            <InputText
              id="foto"
              value={formData.foto || ""}
              onChange={(e) => handleChange("foto", e.target.value)}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>
        </div>

        {jugador?.id && (
          <div className="col-12">
            <div className="field-checkbox">
              <Checkbox
                inputId="activo"
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.checked)}
              />
              <label htmlFor="activo" className="ml-2">
                Activo
              </label>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
