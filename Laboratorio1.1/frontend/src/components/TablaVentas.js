/**
 * VISTA - Tabla de ventas registradas
 * Muestra el listado completo de ventas con opciones de editar y eliminar
 */

import React, { useState } from 'react';
import { eliminarTodasVentas, eliminarVenta, actualizarVenta } from '../services/api';
import './TablaVentas.css';

function TablaVentas({ ventas, onActualizar }) {
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null);
  const [montoEdicion, setMontoEdicion] = useState('');

  const handleEliminarTodas = async () => {
    if (!window.confirm('¿Estás seguro de eliminar todas las ventas?')) {
      return;
    }

    setLoading(true);
    try {
      await eliminarTodasVentas();
      alert('✅ Todas las ventas han sido eliminadas');
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (error) {
      alert('❌ Error al eliminar las ventas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarVenta = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta venta?')) {
      return;
    }

    setLoading(true);
    try {
      await eliminarVenta(id);
      alert('✅ Venta eliminada exitosamente');
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (error) {
      alert('❌ Error al eliminar la venta');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarVenta = (venta) => {
    setEditando(venta.id);
    setMontoEdicion(venta.monto);
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setMontoEdicion('');
  };

  const handleGuardarEdicion = async (id) => {
    if (!montoEdicion || isNaN(montoEdicion) || parseFloat(montoEdicion) <= 0) {
      alert('❌ Por favor ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      await actualizarVenta(id, parseFloat(montoEdicion));
      alert('✅ Venta actualizada exitosamente');
      setEditando(null);
      setMontoEdicion('');
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (error) {
      alert('❌ Error al actualizar la venta');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoClass = (tipo) => {
    switch(tipo) {
      case 'A': return 'tipo-a';
      case 'B': return 'tipo-b';
      case 'C': return 'tipo-c';
      default: return '';
    }
  };

  return (
    <div className="tabla-container">
      <div className="tabla-header">
        <h2>📋 Listado de Ventas ({ventas?.length || 0})</h2>
        {ventas && ventas.length > 0 && (
          <button 
            onClick={handleEliminarTodas} 
            disabled={loading}
            className="btn-eliminar"
          >
            {loading ? 'Eliminando...' : '🗑️ Limpiar Todas'}
          </button>
        )}
      </div>

      {ventas && ventas.length > 0 ? (
        <div className="tabla-scroll">
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td className="monto">
                    {editando === venta.id ? (
                      <input
                        type="number"
                        value={montoEdicion}
                        onChange={(e) => setMontoEdicion(e.target.value)}
                        className="input-edicion"
                        placeholder="Nuevo monto"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      `$${parseFloat(venta.monto).toFixed(2)}`
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getTipoClass(venta.tipo)}`}>
                      {venta.tipo}
                    </span>
                  </td>
                  <td className="fecha">{formatearFecha(venta.fecha)}</td>
                  <td className="acciones">
                    {editando === venta.id ? (
                      <div className="botones-edicion">
                        <button
                          onClick={() => handleGuardarEdicion(venta.id)}
                          disabled={loading}
                          className="btn-guardar"
                          title="Guardar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelarEdicion}
                          disabled={loading}
                          className="btn-cancelar"
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="botones-accion">
                        <button
                          onClick={() => handleEditarVenta(venta)}
                          disabled={loading}
                          className="btn-editar"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleEliminarVenta(venta.id)}
                          disabled={loading}
                          className="btn-eliminar-fila"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-datos">
          <p>📭 No hay ventas registradas</p>
          <p>Registra tu primera venta usando el formulario arriba</p>
        </div>
      )}
    </div>
  );
}

export default TablaVentas;
