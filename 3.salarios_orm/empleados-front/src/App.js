import React, { useState, useEffect } from "react";
import EmpleadoForm from "./components/EmpleadoForm.js";
import EmpleadosList from "./components/EmpleadosList.js";
import EmpleadoDetalle from "./components/EmpleadoDetalle.js";
import * as empleadoService from "./services/empleadoService.js";

function App() {
  const [empleados, setEmpleados] = useState([]);
  const [editEmpleado, setEditEmpleado] = useState(null);
  const [detalle, setDetalle] = useState(null);

  // Obtener todos los empleados del backend usando el servicio
  const obtenerEmpleados = async () => {
    try {
      const data = await empleadoService.obtenerTodosLosEmpleados();
      setEmpleados(data);
    } catch (error) {
      alert("Error al obtener empleados");
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // Crear o actualizar empleado usando el servicio
  const guardarEmpleado = async (empleado) => {
    try {
      if (editEmpleado) {
        // Actualizar empleado existente
        await empleadoService.actualizarEmpleado(editEmpleado.id, empleado);
      } else {
        // Crear nuevo empleado
        await empleadoService.crearEmpleado(empleado);
      }
      obtenerEmpleados();
      setEditEmpleado(null);
      setDetalle(null); // Limpia detalle
    } catch (error) {
      alert("Error al guardar el empleado");
    }
  };

  // Eliminar empleado usando el servicio
  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Eliminar este empleado?")) return;
    try {
      await empleadoService.eliminarEmpleado(id);
      obtenerEmpleados();
      setDetalle(null); // Limpia detalle
    } catch (error) {
      alert("Error al eliminar el empleado");
    }
  };

  // Ver detalle del salario usando el servicio
  const verDetalle = async (empleado) => {
    try {
      const data = await empleadoService.obtenerSalarioEmpleado(empleado.id);
      setDetalle(data);
    } catch (error) {
      alert("No se pudo obtener el detalle del salario.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Gestión de Salarios</h1>

      <EmpleadoForm
        onGuardar={guardarEmpleado}
        editEmpleado={editEmpleado}
        onCancelEdit={() => setEditEmpleado(null)}
      />

      <EmpleadosList
        empleados={empleados}
        onEliminar={eliminarEmpleado}
        onEditar={setEditEmpleado}
        onVer={verDetalle}
      />

      {/* Mostrar detalle solo si existe */}
      {detalle && detalle.total !== undefined && (
        <EmpleadoDetalle detalle={detalle} />
      )}
    </div>
  );
}

export default App;
