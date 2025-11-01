import React from "react";

const EstudiantesList = ({ estudiantes, onEdit, onDelete }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Lista de Estudiantes</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Nombre
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Carrera
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No hay estudiantes registrados
              </td>
            </tr>
          ) : (
            estudiantes.map((estudiante) => (
              <tr key={estudiante.id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {estudiante.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {estudiante.nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {estudiante.carrera}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(estudiante)}
                    style={{
                      padding: "5px 10px",
                      marginRight: "5px",
                      cursor: "pointer",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(estudiante.id)}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EstudiantesList;
