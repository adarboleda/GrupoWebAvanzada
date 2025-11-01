import React, { useState, useEffect } from "react";

const DocenteForm = ({ onSubmit, editDocente, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  useEffect(() => {
    if (editDocente) {
      setNombre(editDocente.nombre);
      setApellido(editDocente.apellido);
      setEmail(editDocente.email);
      setEspecialidad(editDocente.especialidad || "");
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
      setEspecialidad("");
    }
  }, [editDocente]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !email) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    onSubmit({ nombre, apellido, email, especialidad });
    setNombre("");
    setApellido("");
    setEmail("");
    setEspecialidad("");
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3>{editDocente ? "Editar Docente" : "Crear Nuevo Docente"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Apellidos
          </label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Apellidos"
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Email de empresa
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@empresa.com"
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Especialidad
          </label>
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Especialidad"
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: "8px 15px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            {editDocente ? "Actualizar" : "Crear"}
          </button>
          {editDocente && (
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: "8px 15px", cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DocenteForm;
