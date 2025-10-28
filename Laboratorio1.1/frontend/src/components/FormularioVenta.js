/**
 * VISTA - Formulario para registrar nuevas ventas
 * Componente que permite al usuario ingresar ventas
 */

import React, { useState } from 'react';
import { crearVenta } from '../services/api';
import './FormularioVenta.css';

function FormularioVenta({ onVentaCreada }) {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!monto || parseFloat(monto) <= 0) {
      setMensaje('Por favor ingresa un monto válido');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const resultado = await crearVenta(parseFloat(monto));
      setMensaje(`✅ Venta registrada: $${resultado.monto} - Tipo ${resultado.tipo}`);
      setMonto('');
      
      // Notificar al componente padre para actualizar datos
      if (onVentaCreada) {
        onVentaCreada();
      }
    } catch (error) {
      setMensaje('❌ Error al registrar la venta. Verifica el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h2>📝 Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label htmlFor="monto">Monto de la venta ($):</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 750.50"
            step="0.01"
            min="0"
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Registrando...' : 'Registrar Venta'}
        </button>
      </form>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('❌') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      <div className="info-clasificacion">
        <h3>📊 Clasificación de Ventas:</h3>
        <ul>
          <li><strong>Tipo A:</strong> Mayor a $1000</li>
          <li><strong>Tipo B:</strong> Mayor a $500 pero ≤ $1000</li>
          <li><strong>Tipo C:</strong> Menor o igual a $500</li>
        </ul>
      </div>
    </div>
  );
}

export default FormularioVenta;
