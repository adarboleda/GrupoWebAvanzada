import React, { useState, useEffect } from "react";

const EstudianteForm = ({ onSubmit, editEstudiante, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [carrera, setCarrera] = useState("");

  useEffect(() => {
    if (editEstudiante) {
      setNombre(editEstudiante.nombre);
      setCarrera(editEstudiante.carrera);
    } else {
      setNombre("");
      setCarrera("");
    }
  }, [editEstudiante]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !carrera) {
      alert("Por favor completa todos los campos");
      return;
    }
    onSubmit({ nombre, carrera });
    setNombre("");
    setCarrera("");
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
      <h3>{editEstudiante ? "Editar Estudiante" : "Crear Nuevo Estudiante"}</h3>
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
            Nombre Completo
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
            Carrera
          </label>
          <input
            type="text"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            placeholder="Carrera"
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
            {editEstudiante ? "Actualizar" : "Crear"}
          </button>
          {editEstudiante && (
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

export default EstudianteForm;
