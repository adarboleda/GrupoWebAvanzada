import React, { useState, useEffect } from "react";

const AsignaturaForm = ({ onSubmit, editAsignatura, onCancel, docentes }) => {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [creditos, setCreditos] = useState("");
  const [docenteId, setDocenteId] = useState("");

  useEffect(() => {
    if (editAsignatura) {
      setNombre(editAsignatura.nombre);
      setCodigo(editAsignatura.codigo);
      setCreditos(editAsignatura.creditos);
      setDocenteId(editAsignatura.docenteId);
    } else {
      setNombre("");
      setCodigo("");
      setCreditos("");
      setDocenteId("");
    }
  }, [editAsignatura]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !codigo || !creditos || !docenteId) {
      alert("Por favor completa todos los campos");
      return;
    }
    onSubmit({
      nombre,
      codigo,
      creditos: parseInt(creditos),
      docenteId: parseInt(docenteId),
    });
    setNombre("");
    setCodigo("");
    setCreditos("");
    setDocenteId("");
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
      <h3>{editAsignatura ? "Editar Asignatura" : "Crear Nueva Asignatura"}</h3>
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
            Código
          </label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código"
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
            Créditos
          </label>
          <input
            type="number"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
            placeholder="Créditos"
            min="1"
            max="10"
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
            Docente
          </label>
          <select
            value={docenteId}
            onChange={(e) => setDocenteId(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              backgroundColor: "white",
            }}
          >
            <option value="">Seleccionar docente</option>
            {docentes.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre} {docente.apellido}
              </option>
            ))}
          </select>
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
            {editAsignatura ? "Actualizar" : "Crear"}
          </button>
          {editAsignatura && (
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

export default AsignaturaForm;
