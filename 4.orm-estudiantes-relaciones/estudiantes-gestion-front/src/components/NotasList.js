import React from "react";

const NotasList = ({ notas, onEdit, onDelete }) => {
  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case "Sobresaliente":
        return "#28a745";
      case "Aprobado":
        return "#ffc107";
      case "Reprobado":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Lista de Notas</h3>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Estudiante
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Asignatura
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Docente
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Nota 1
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Nota 2
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Nota 3
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Promedio
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Categoría
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                No hay notas registradas
              </td>
            </tr>
          ) : (
            notas.map((nota) => (
              <tr key={nota.id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {nota.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {nota.Estudiante ? nota.Estudiante.nombre : "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {nota.Asignatura ? nota.Asignatura.nombre : "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {nota.Asignatura && nota.Asignatura.Docente
                    ? `${nota.Asignatura.Docente.nombre} ${nota.Asignatura.Docente.apellido}`
                    : "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {nota.nota1}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {nota.nota2}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {nota.nota3}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {nota.promedio}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: getCategoriaColor(nota.categoria),
                  }}
                >
                  {nota.categoria}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(nota)}
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
                    onClick={() => onDelete(nota.id)}
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

export default NotasList;
