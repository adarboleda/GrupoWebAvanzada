/**
 * VISTA - Componente de estadísticas de ventas
 * Muestra los totales y cantidades por categoría
 */

import React from 'react';
import './EstadisticasVentas.css';

function EstadisticasVentas({ estadisticas }) {
  if (!estadisticas) {
    return <p>No hay datos disponibles</p>;
  }

  const {
    total_ventas,
    ventas_tipo_a,
    ventas_tipo_b,
    ventas_tipo_c,
    total_tipo_a,
    total_tipo_b,
    total_tipo_c,
    total_general
  } = estadisticas;

  return (
    <div className="estadisticas-container">
      <h2>📈 Estadísticas de Ventas</h2>
      
      <div className="estadisticas-grid">
        {/* Resumen General */}
        <div className="stat-card total">
          <h3>Total General</h3>
          <p className="stat-number">{total_ventas || 0}</p>
          <p className="stat-label">Ventas</p>
          <p className="stat-amount">${parseFloat(total_general || 0).toFixed(2)}</p>
        </div>

        {/* Tipo A */}
        <div className="stat-card tipo-a">
          <h3>Tipo A (&gt; $1000)</h3>
          <p className="stat-number">{ventas_tipo_a || 0}</p>
          <p className="stat-label">Ventas</p>
          <p className="stat-amount">${parseFloat(total_tipo_a || 0).toFixed(2)}</p>
        </div>

        {/* Tipo B */}
        <div className="stat-card tipo-b">
          <h3>Tipo B ($500 - $1000)</h3>
          <p className="stat-number">{ventas_tipo_b || 0}</p>
          <p className="stat-label">Ventas</p>
          <p className="stat-amount">${parseFloat(total_tipo_b || 0).toFixed(2)}</p>
        </div>

        {/* Tipo C */}
        <div className="stat-card tipo-c">
          <h3>Tipo C (≤ $500)</h3>
          <p className="stat-number">{ventas_tipo_c || 0}</p>
          <p className="stat-label">Ventas</p>
          <p className="stat-amount">${parseFloat(total_tipo_c || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Diagrama de flujo de datos */}
      <div className="flujo-datos">
        <h3>🔄 Flujo de Datos MVC</h3>
        <div className="flujo-steps">
          <div className="step">Vista (React)<br/>↓<br/>Solicitud</div>
          <div className="step">Controlador (API)<br/>↓<br/>Procesa</div>
          <div className="step">Modelo (MySQL)<br/>↓<br/>Retorna</div>
          <div className="step">Vista (React)<br/>↓<br/>Muestra</div>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasVentas;
