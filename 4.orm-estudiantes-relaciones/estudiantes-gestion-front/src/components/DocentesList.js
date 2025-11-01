import React from "react";

const DocentesList = ({ docentes, onEdit, onDelete }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Lista de Docentes</h3>
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
              Apellido
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Especialidad
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No hay docentes registrados
              </td>
            </tr>
          ) : (
            docentes.map((docente) => (
              <tr key={docente.id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {docente.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {docente.nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {docente.apellido}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {docente.email}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {docente.especialidad || "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(docente)}
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
                    onClick={() => onDelete(docente.id)}
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

export default DocentesList;
