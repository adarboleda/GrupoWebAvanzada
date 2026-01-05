import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

/**
 * Componente Form - VISTA del patrón MVC
 * Ejercicio 2: Reajuste de Sueldos según Antigüedad
 * Autor: Esteban Santos
 * 
 * RESPONSABILIDAD DE LA VISTA:
 * - Campos para ingresar nombre, antigüedad y sueldo actual
 * - Botón para calcular reajuste Y guardar en la base de datos
 * - Resultado: porcentaje aplicado, nuevo sueldo final y confirmación de guardado
 * - Comunicación con API REST para cálculo y persistencia de datos
 */
const Form = () => {
  // Estados para los campos del formulario
  const [nombreEmpleado, setNombreEmpleado] = useState('');
  const [antiguedad, setAntiguedad] = useState('');
  const [sueldoActual, setSueldoActual] = useState('');
  
  // Estados para el resultado
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // URL de la API (Backend)
  const API_URL = 'http://localhost:3001/api/empleados/calcular';
  const API_GUARDAR_URL = 'http://localhost:3001/api/empleados';

  /**
   * Función para manejar el envío del formulario
   * MODIFICADO: Ahora calcula Y guarda en la base de datos
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes previos
    setError('');
    setResultado(null);
    setGuardado(false);
    
    // Validaciones en el frontend
    if (!nombreEmpleado.trim()) {
      setError('Por favor ingresa el nombre del empleado');
      return;
    }

    if (antiguedad === '' || antiguedad < 0) {
      setError('La antigüedad debe ser un número mayor o igual a 0');
      return;
    }

    if (sueldoActual === '' || sueldoActual <= 0) {
      setError('El sueldo debe ser un número mayor a 0');
      return;
    }

    // Iniciar carga
    setLoading(true);

    try {
      // PASO 1: Calcular el reajuste (sin guardar)
      const responseCalculo = await axios.post(API_URL, {
        nombreEmpleado: nombreEmpleado,
        antiguedad: parseInt(antiguedad),
        sueldoActual: parseFloat(sueldoActual)
      });

      // Guardar el resultado del cálculo
      setResultado(responseCalculo.data);

      // PASO 2: Guardar en la base de datos
      await axios.post(API_GUARDAR_URL, {
        nombreEmpleado: nombreEmpleado,
        antiguedad: parseInt(antiguedad),
        sueldoActual: parseFloat(sueldoActual)
      });

      // Indicar que se guardó exitosamente
      setGuardado(true);

    } catch (err) {
      // Manejar errores
      if (err.response && err.response.data) {
        setError(err.response.data.error || err.response.data.mensaje || 'Error al procesar la solicitud');
      } else {
        setError('Error de conexión con el servidor. Verifica que el backend esté corriendo en http://localhost:3001');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para limpiar el formulario
   */
  const handleLimpiar = () => {
    setNombreEmpleado('');
    setAntiguedad('');
    setSueldoActual('');
    setResultado(null);
    setError('');
    setGuardado(false);
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

  return (
    <div className="form-container">
      <div className="header">
        <h1>💰 Sistema de Reajuste de Sueldos</h1>
        <p className="subtitle">Ejercicio 2 - Esteban Santos</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {/* Campo: Nombre del Empleado */}
        <div className="form-group">
          <label htmlFor="nombreEmpleado">
            👤 Nombre del Empleado
          </label>
          <input
            type="text"
            id="nombreEmpleado"
            value={nombreEmpleado}
            onChange={(e) => setNombreEmpleado(e.target.value)}
            placeholder="Ej: Juan Pérez"
            disabled={loading}
          />
        </div>

        {/* Campo: Antigüedad */}
        <div className="form-group">
          <label htmlFor="antiguedad">
            📅 Antigüedad (años)
          </label>
          <input
            type="number"
            id="antiguedad"
            value={antiguedad}
            onChange={(e) => setAntiguedad(e.target.value)}
            placeholder="Ej: 5"
            min="0"
            max="50"
            disabled={loading}
          />
          <small>Ingresa los años de antigüedad (0-20 años)</small>
        </div>

        {/* Campo: Sueldo Actual */}
        <div className="form-group">
          <label htmlFor="sueldoActual">
            💵 Sueldo Actual ($)
          </label>
          <input
            type="number"
            id="sueldoActual"
            value={sueldoActual}
            onChange={(e) => setSueldoActual(e.target.value)}
            placeholder="Ej: 250000"
            min="1"
            step="1000"
            disabled={loading}
          />
          <small>Ingresa el sueldo actual en pesos</small>
        </div>

        {/* Botones */}
        <div className="button-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Procesando...' : '💾 Calcular y Guardar'}
          </button>
          <button 
            type="button" 
            onClick={handleLimpiar}
            className="btn btn-secondary"
            disabled={loading}
          >
            🔄 Limpiar
          </button>
        </div>
      </form>

      {/* Mensajes de Error */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Mensaje de Guardado Exitoso */}
      {guardado && !error && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>¡Empleado guardado exitosamente en la base de datos!</span>
        </div>
      )}

      {/* Resultados */}
      {resultado && resultado.success && (
        <div className="result-container">
          <div className="result-header">
            <h2>✅ Resultado del Cálculo</h2>
          </div>

          <div className="result-content">
            {/* Información del Empleado */}
            <div className="result-section">
              <h3>Empleado</h3>
              <p className="employee-name">{resultado.empleado.nombreEmpleado}</p>
            </div>

            {/* Datos Ingresados */}
            <div className="result-section">
              <h3>Datos Ingresados</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Antigüedad:</span>
                  <span className="result-value">{resultado.calculo.antiguedad} años</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Sueldo Actual:</span>
                  <span className="result-value">{formatearMoneda(resultado.calculo.sueldoActual)}</span>
                </div>
              </div>
            </div>

            {/* Cálculo del Reajuste */}
            <div className="result-section highlight">
              <h3>📊 Cálculo del Reajuste</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Porcentaje de Reajuste:</span>
                  <span className="result-value percentage">{resultado.calculo.porcentajeReajuste}%</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Monto del Reajuste:</span>
                  <span className="result-value amount">{formatearMoneda(resultado.calculo.montoReajuste)}</span>
                </div>
              </div>
            </div>

            {/* Nuevo Sueldo */}
            <div className="result-section final">
              <h3>💰 Nuevo Sueldo</h3>
              <p className="new-salary">{formatearMoneda(resultado.calculo.nuevoSueldo)}</p>
            </div>

            {/* Mensaje Explicativo */}
            <div className="result-message">
              <p>{resultado.calculo.mensaje}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Referencias */}
      <div className="reference-table">
        <h3>📋 Tabla de Reajustes</h3>
        <table>
          <thead>
            <tr>
              <th>Antigüedad</th>
              <th>Sueldo</th>
              <th>Reajuste</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="3">Hasta 10 años</td>
              <td>Hasta $300,000</td>
              <td className="percentage">12%</td>
            </tr>
            <tr>
              <td>$300,001 - $500,000</td>
              <td className="percentage">10%</td>
            </tr>
            <tr>
              <td>Más de $500,000</td>
              <td className="percentage">8%</td>
            </tr>
            <tr>
              <td rowSpan="3">Más de 10 hasta 20 años</td>
              <td>Hasta $300,000</td>
              <td className="percentage">14%</td>
            </tr>
            <tr>
              <td>$300,001 - $500,000</td>
              <td className="percentage">12%</td>
            </tr>
            <tr>
              <td>Más de $500,000</td>
              <td className="percentage">10%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Desarrollado por <strong>Esteban Santos</strong></p>
        <p>Programación Web Avanzada - 2025</p>
      </div>
    </div>
  );
};

export default Form;
