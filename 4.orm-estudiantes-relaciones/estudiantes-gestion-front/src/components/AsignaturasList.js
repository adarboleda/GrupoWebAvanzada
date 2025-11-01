import React from "react";

const AsignaturasList = ({ asignaturas, onEdit, onDelete }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Lista de Asignaturas</h3>
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
              Código
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Créditos
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Docente
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No hay asignaturas registradas
              </td>
            </tr>
          ) : (
            asignaturas.map((asignatura) => (
              <tr key={asignatura.id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {asignatura.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {asignatura.nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {asignatura.codigo}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {asignatura.creditos}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {asignatura.Docente
                    ? `${asignatura.Docente.nombre} ${asignatura.Docente.apellido}`
                    : "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(asignatura)}
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
                    onClick={() => onDelete(asignatura.id)}
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

export default AsignaturasList;
