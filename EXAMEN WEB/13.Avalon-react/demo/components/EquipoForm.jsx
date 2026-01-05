"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";

export default function EquipoForm({ visible, equipo, onHide, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    estadio: "",
    fundacion: null,
    escudo: "",
    entrenador: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (equipo) {
      setFormData(equipo);
    } else {
      setFormData({
        nombre: "",
        ciudad: "",
        estadio: "",
        fundacion: null,
        escudo: "",
        entrenador: "",
        activo: true,
      });
    }
    setErrors({});
  }, [equipo, visible]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim() === "") {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.ciudad || formData.ciudad.trim() === "") {
      newErrors.ciudad = "La ciudad es obligatoria";
    }

    if (formData.fundacion && (formData.fundacion < 1800 || formData.fundacion > new Date().getFullYear())) {
      newErrors.fundacion = "El año de fundación no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
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
      header={equipo?.id ? "Editar Equipo" : "Nuevo Equipo"}
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={onHide}
    >
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

      <div className="field">
        <label htmlFor="ciudad" className="font-bold">
          Ciudad *
        </label>
        <InputText
          id="ciudad"
          value={formData.ciudad}
          onChange={(e) => handleChange("ciudad", e.target.value)}
          className={errors.ciudad ? "p-invalid" : ""}
        />
        {errors.ciudad && <small className="p-error">{errors.ciudad}</small>}
      </div>

      <div className="field">
        <label htmlFor="estadio" className="font-bold">
          Estadio
        </label>
        <InputText
          id="estadio"
          value={formData.estadio || ""}
          onChange={(e) => handleChange("estadio", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="fundacion" className="font-bold">
          Año de Fundación
        </label>
        <InputNumber
          id="fundacion"
          value={formData.fundacion}
          onValueChange={(e) => handleChange("fundacion", e.value)}
          useGrouping={false}
          className={errors.fundacion ? "p-invalid" : ""}
        />
        {errors.fundacion && <small className="p-error">{errors.fundacion}</small>}
      </div>

      <div className="field">
        <label htmlFor="entrenador" className="font-bold">
          Entrenador
        </label>
        <InputText
          id="entrenador"
          value={formData.entrenador || ""}
          onChange={(e) => handleChange("entrenador", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="escudo" className="font-bold">
          URL del Escudo
        </label>
        <InputText
          id="escudo"
          value={formData.escudo || ""}
          onChange={(e) => handleChange("escudo", e.target.value)}
          placeholder="https://ejemplo.com/escudo.png"
        />
      </div>

      {equipo?.id && (
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
      )}
    </Dialog>
  );
}
