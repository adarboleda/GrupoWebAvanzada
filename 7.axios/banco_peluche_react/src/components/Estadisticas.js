import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { exportarEstadisticasPDF, exportarEstadisticasExcel } from '../services/exportService';
import './Estadisticas.css';

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await clienteService.obtenerEstadisticas();
      if (response.ok) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      alert('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (!estadisticas) {
    return <div className="error">No se pudieron cargar las estadísticas</div>;
  }

  const porcentajeMorosos =
    estadisticas.total > 0 ? ((estadisticas.morosos / estadisticas.total) * 100).toFixed(2) : 0;

  const porcentajeNoMorosos =
    estadisticas.total > 0 ? ((estadisticas.noMorosos / estadisticas.total) * 100).toFixed(2) : 0;

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>Estadísticas de Clientes</h1>
        <div className="header-actions">
          <button className="btn-export" onClick={() => exportarEstadisticasPDF(estadisticas)}>
            Exportar PDF
          </button>
          <button className="btn-export" onClick={() => exportarEstadisticasExcel(estadisticas)}>
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total de Clientes</h3>
            <p className="stat-number">{estadisticas.total}</p>
            <p className="stat-description">Clientes registrados en el sistema</p>
          </div>
        </div>

        <div className="stat-card morosos">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Clientes Morosos</h3>
            <p className="stat-number">{estadisticas.morosos}</p>
            <p className="stat-description">{porcentajeMorosos}% del total</p>
            <div className="progress-bar">
              <div
                className="progress-fill moroso"
                style={{ width: `${porcentajeMorosos}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card no-morosos">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Clientes al Día</h3>
            <p className="stat-number">{estadisticas.noMorosos}</p>
            <p className="stat-description">{porcentajeNoMorosos}% del total</p>
            <div className="progress-bar">
              <div
                className="progress-fill aldia"
                style={{ width: `${porcentajeNoMorosos}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Distribución de Clientes</h2>
        <div className="chart-wrapper">
          <div className="pie-chart">
            <svg viewBox="0 0 200 200" className="pie">
              {estadisticas.total > 0 && (
                <>
                  <circle
                    r="90"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    stroke="#4caf50"
                    strokeWidth="20"
                    strokeDasharray={`${(estadisticas.noMorosos / estadisticas.total) * 565} 565`}
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    r="90"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    stroke="#ff4444"
                    strokeWidth="20"
                    strokeDasharray={`${(estadisticas.morosos / estadisticas.total) * 565} 565`}
                    strokeDashoffset={`-${(estadisticas.noMorosos / estadisticas.total) * 565}`}
                    transform="rotate(-90 100 100)"
                  />
                </>
              )}
            </svg>
            <div className="pie-center">
              <div className="pie-total">{estadisticas.total}</div>
              <div className="pie-label">Total</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color aldia"></div>
              <div className="legend-text">
                <strong>Clientes al Día</strong>
                <span>
                  {estadisticas.noMorosos} ({porcentajeNoMorosos}%)
                </span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color moroso"></div>
              <div className="legend-text">
                <strong>Clientes Morosos</strong>
                <span>
                  {estadisticas.morosos} ({porcentajeMorosos}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-container">
        <h2>Análisis</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Estado General</h4>
            <p>
              {porcentajeMorosos < 20
                ? '✅ La mayoría de los clientes están al día con sus pagos.'
                : porcentajeMorosos < 50
                ? '⚠️ Hay un porcentaje considerable de clientes morosos.'
                : '🚨 Alerta: Más de la mitad de los clientes están en mora.'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Recomendación</h4>
            <p>
              {estadisticas.morosos > 0
                ? `Se recomienda realizar seguimiento a los ${estadisticas.morosos} cliente(s) moroso(s).`
                : 'Excelente gestión. No hay clientes en mora.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
