import React, { useState, useEffect } from "react";
import "./App.css";

// Servicios
import * as estudianteService from "./services/estudianteService";
import * as docenteService from "./services/docenteService";
import * as asignaturaService from "./services/asignaturaService";
import * as notaService from "./services/notaService";

// Componentes
import EstudianteForm from "./components/EstudianteForm";
import EstudiantesList from "./components/EstudiantesList";
import DocenteForm from "./components/DocenteForm";
import DocentesList from "./components/DocentesList";
import AsignaturaForm from "./components/AsignaturaForm";
import AsignaturasList from "./components/AsignaturasList";
import NotaForm from "./components/NotaForm";
import NotasList from "./components/NotasList";

function App() {
  const [activeTab, setActiveTab] = useState("estudiantes");

  // Estados para Estudiantes
  const [estudiantes, setEstudiantes] = useState([]);
  const [editEstudiante, setEditEstudiante] = useState(null);

  // Estados para Docentes
  const [docentes, setDocentes] = useState([]);
  const [editDocente, setEditDocente] = useState(null);

  // Estados para Asignaturas
  const [asignaturas, setAsignaturas] = useState([]);
  const [editAsignatura, setEditAsignatura] = useState(null);

  // Estados para Notas
  const [notas, setNotas] = useState([]);
  const [editNota, setEditNota] = useState(null);

  // Cargar todos los datos al iniciar
  useEffect(() => {
    cargarEstudiantes();
    cargarDocentes();
    cargarAsignaturas();
    cargarNotas();
  }, []);

  // ============ ESTUDIANTES ============
  const cargarEstudiantes = async () => {
    try {
      const data = await estudianteService.obtenerTodosLosEstudiantes();
      setEstudiantes(data);
    } catch (error) {
      alert("Error al cargar estudiantes");
    }
  };

  const handleEstudianteSubmit = async (estudiante) => {
    try {
      if (editEstudiante) {
        await estudianteService.actualizarEstudiante(
          editEstudiante.id,
          estudiante
        );
        alert("Estudiante actualizado exitosamente");
        setEditEstudiante(null);
      } else {
        await estudianteService.crearEstudiante(estudiante);
        alert("Estudiante creado exitosamente");
      }
      cargarEstudiantes();
    } catch (error) {
      alert("Error al guardar estudiante");
    }
  };

  const handleEditEstudiante = (estudiante) => {
    setEditEstudiante(estudiante);
  };

  const handleDeleteEstudiante = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      try {
        await estudianteService.eliminarEstudiante(id);
        alert("Estudiante eliminado exitosamente");
        cargarEstudiantes();
      } catch (error) {
        alert("Error al eliminar estudiante");
      }
    }
  };

  // ============ DOCENTES ============
  const cargarDocentes = async () => {
    try {
      const data = await docenteService.obtenerTodosLosDocentes();
      setDocentes(data);
    } catch (error) {
      alert("Error al cargar docentes");
    }
  };

  const handleDocenteSubmit = async (docente) => {
    try {
      if (editDocente) {
        await docenteService.actualizarDocente(editDocente.id, docente);
        alert("Docente actualizado exitosamente");
        setEditDocente(null);
      } else {
        await docenteService.crearDocente(docente);
        alert("Docente creado exitosamente");
      }
      cargarDocentes();
    } catch (error) {
      alert("Error al guardar docente");
    }
  };

  const handleEditDocente = (docente) => {
    setEditDocente(docente);
  };

  const handleDeleteDocente = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este docente?")) {
      try {
        await docenteService.eliminarDocente(id);
        alert("Docente eliminado exitosamente");
        cargarDocentes();
      } catch (error) {
        alert("Error al eliminar docente");
      }
    }
  };

  // ============ ASIGNATURAS ============
  const cargarAsignaturas = async () => {
    try {
      const data = await asignaturaService.obtenerTodasLasAsignaturas();
      setAsignaturas(data);
    } catch (error) {
      alert("Error al cargar asignaturas");
    }
  };

  const handleAsignaturaSubmit = async (asignatura) => {
    try {
      if (editAsignatura) {
        await asignaturaService.actualizarAsignatura(
          editAsignatura.id,
          asignatura
        );
        alert("Asignatura actualizada exitosamente");
        setEditAsignatura(null);
      } else {
        await asignaturaService.crearAsignatura(asignatura);
        alert("Asignatura creada exitosamente");
      }
      cargarAsignaturas();
    } catch (error) {
      alert("Error al guardar asignatura");
    }
  };

  const handleEditAsignatura = (asignatura) => {
    setEditAsignatura(asignatura);
  };

  const handleDeleteAsignatura = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta asignatura?")) {
      try {
        await asignaturaService.eliminarAsignatura(id);
        alert("Asignatura eliminada exitosamente");
        cargarAsignaturas();
      } catch (error) {
        alert("Error al eliminar asignatura");
      }
    }
  };

  // ============ NOTAS ============
  const cargarNotas = async () => {
    try {
      const data = await notaService.obtenerTodasLasNotas();
      setNotas(data);
    } catch (error) {
      alert("Error al cargar notas");
    }
  };

  const handleNotaSubmit = async (nota) => {
    try {
      if (editNota) {
        await notaService.actualizarNota(editNota.id, nota);
        alert("Nota actualizada exitosamente");
        setEditNota(null);
      } else {
        await notaService.crearNota(nota);
        alert("Nota creada exitosamente");
      }
      cargarNotas();
    } catch (error) {
      alert(error.message || "Error al guardar nota");
    }
  };

  const handleEditNota = (nota) => {
    setEditNota(nota);
  };

  const handleDeleteNota = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta nota?")) {
      try {
        await notaService.eliminarNota(id);
        alert("Nota eliminada exitosamente");
        cargarNotas();
      } catch (error) {
        alert("Error al eliminar nota");
      }
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Sistema de Gestión de Notas</h1>

      {/* Pestañas */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("estudiantes")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            backgroundColor:
              activeTab === "estudiantes" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Estudiantes
        </button>
        <button
          onClick={() => setActiveTab("docentes")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            backgroundColor: activeTab === "docentes" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Docentes
        </button>
        <button
          onClick={() => setActiveTab("asignaturas")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            backgroundColor:
              activeTab === "asignaturas" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Asignaturas
        </button>
        <button
          onClick={() => setActiveTab("notas")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: activeTab === "notas" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Notas
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === "estudiantes" && (
        <div>
          <EstudianteForm
            onSubmit={handleEstudianteSubmit}
            editEstudiante={editEstudiante}
            onCancel={() => setEditEstudiante(null)}
          />
          <EstudiantesList
            estudiantes={estudiantes}
            onEdit={handleEditEstudiante}
            onDelete={handleDeleteEstudiante}
          />
        </div>
      )}

      {activeTab === "docentes" && (
        <div>
          <DocenteForm
            onSubmit={handleDocenteSubmit}
            editDocente={editDocente}
            onCancel={() => setEditDocente(null)}
          />
          <DocentesList
            docentes={docentes}
            onEdit={handleEditDocente}
            onDelete={handleDeleteDocente}
          />
        </div>
      )}

      {activeTab === "asignaturas" && (
        <div>
          <AsignaturaForm
            onSubmit={handleAsignaturaSubmit}
            editAsignatura={editAsignatura}
            onCancel={() => setEditAsignatura(null)}
            docentes={docentes}
          />
          <AsignaturasList
            asignaturas={asignaturas}
            onEdit={handleEditAsignatura}
            onDelete={handleDeleteAsignatura}
          />
        </div>
      )}

      {activeTab === "notas" && (
        <div>
          <NotaForm
            onSubmit={handleNotaSubmit}
            editNota={editNota}
            onCancel={() => setEditNota(null)}
            estudiantes={estudiantes}
            asignaturas={asignaturas}
          />
          <NotasList
            notas={notas}
            onEdit={handleEditNota}
            onDelete={handleDeleteNota}
          />
        </div>
      )}
    </div>
  );
}

export default App;
