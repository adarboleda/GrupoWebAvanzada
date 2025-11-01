import React, { useState, useEffect } from "react";

const NotaForm = ({
  onSubmit,
  editNota,
  onCancel,
  estudiantes,
  asignaturas,
}) => {
  const [estudianteId, setEstudianteId] = useState("");
  const [asignaturaId, setAsignaturaId] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");

  useEffect(() => {
    if (editNota) {
      setEstudianteId(editNota.estudianteId);
      setAsignaturaId(editNota.asignaturaId);
      setNota1(editNota.nota1);
      setNota2(editNota.nota2);
      setNota3(editNota.nota3);
    } else {
      setEstudianteId("");
      setAsignaturaId("");
      setNota1("");
      setNota2("");
      setNota3("");
    }
  }, [editNota]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!estudianteId || !asignaturaId || !nota1 || !nota2 || !nota3) {
      alert("Por favor completa todos los campos");
      return;
    }

    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    const n3 = parseFloat(nota3);

    if (n1 < 0 || n1 > 20 || n2 < 0 || n2 > 20 || n3 < 0 || n3 > 20) {
      alert("Las notas deben estar entre 0 y 20");
      return;
    }

    onSubmit({
      estudianteId: parseInt(estudianteId),
      asignaturaId: parseInt(asignaturaId),
      nota1: n1,
      nota2: n2,
      nota3: n3,
    });

    setEstudianteId("");
    setAsignaturaId("");
    setNota1("");
    setNota2("");
    setNota3("");
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
      <h3>{editNota ? "Editar Nota" : "Crear Nueva Nota"}</h3>
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
            Estudiante
          </label>
          <select
            value={estudianteId}
            onChange={(e) => setEstudianteId(e.target.value)}
            disabled={editNota} // No se puede cambiar el estudiante al editar
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
            <option value="">Seleccionar estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre}
              </option>
            ))}
          </select>
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
            Asignatura
          </label>
          <select
            value={asignaturaId}
            onChange={(e) => setAsignaturaId(e.target.value)}
            disabled={editNota} // No se puede cambiar la asignatura al editar
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
            <option value="">Seleccionar asignatura</option>
            {asignaturas.map((asignatura) => (
              <option key={asignatura.id} value={asignatura.id}>
                {asignatura.nombre} ({asignatura.codigo})
              </option>
            ))}
          </select>
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
            Nota 1
          </label>
          <input
            type="number"
            step="0.01"
            value={nota1}
            onChange={(e) => setNota1(e.target.value)}
            placeholder="0-20"
            min="0"
            max="20"
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
            Nota 2
          </label>
          <input
            type="number"
            step="0.01"
            value={nota2}
            onChange={(e) => setNota2(e.target.value)}
            placeholder="0-20"
            min="0"
            max="20"
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
            Nota 3
          </label>
          <input
            type="number"
            step="0.01"
            value={nota3}
            onChange={(e) => setNota3(e.target.value)}
            placeholder="0-20"
            min="0"
            max="20"
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
            {editNota ? "Actualizar" : "Crear"}
          </button>
          {editNota && (
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

export default NotaForm;
