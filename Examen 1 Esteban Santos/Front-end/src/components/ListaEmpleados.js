import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaEmpleados.css';

/**
 * Componente ListaEmpleados
 * Muestra todos los empleados guardados en la base de datos
 */
const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3001/api/empleados';

  /**
   * Cargar empleados al montar el componente
   */
  useEffect(() => {
    cargarEmpleados();
  }, []);

  /**
   * Función para cargar empleados desde la API
   */
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setEmpleados(response.data.empleados || response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los empleados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para eliminar un empleado
   */
  const eliminarEmpleado = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este empleado?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      // Recargar la lista
      cargarEmpleados();
    } catch (err) {
      alert('Error al eliminar el empleado');
      console.error(err);
    }
  };

  /**
   * Función para formatear números como moneda
   */
  const formatearMoneda = (numero) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numero);
  };

  /**
   * Función para formatear fecha
   */
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>📋 Lista de Empleados Registrados</h2>
        <button onClick={cargarEmpleados} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {loading && (
        <div className="loading">
          <p>⏳ Cargando empleados...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && empleados.length === 0 && (
        <div className="empty-state">
          <p>📭 No hay empleados registrados</p>
          <p className="empty-subtitle">Usa el formulario de arriba para agregar empleados</p>
        </div>
      )}

      {!loading && !error && empleados.length > 0 && (
        <div className="tabla-wrapper">
          <table className="tabla-empleados">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Antigüedad</th>
                <th>Sueldo Actual</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.id}</td>
                  <td className="nombre-empleado">{empleado.nombreEmpleado}</td>
                  <td>{empleado.antiguedad} años</td>
                  <td className="sueldo">{formatearMoneda(empleado.sueldoActual)}</td>
                  <td className="fecha">{formatearFecha(empleado.createdAt)}</td>
                  <td>
                    <button 
                      onClick={() => eliminarEmpleado(empleado.id)}
                      className="btn-eliminar"
                      title="Eliminar empleado"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="tabla-footer">
            <p>Total de empleados: <strong>{empleados.length}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEmpleados;
