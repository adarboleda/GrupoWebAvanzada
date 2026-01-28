import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { polizasAPI } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    polizasCalculadas: 0,
    recaudoTotal: 0,
    clientesActivos: 0
  });

  const [polizasRecientes, setPolizasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const [polizas, estadisticas] = await Promise.all([
        polizasAPI.obtenerTodas(),
        polizasAPI.obtenerEstadisticas()
      ]);
      setStats({
        totalClientes: polizas.length,
        polizasCalculadas: estadisticas.totalPolizas || polizas.length,
        recaudoTotal: estadisticas.recaudoTotal || 0,
        clientesActivos: polizas.filter(p => p.costoPoliza > 0).length
      });
      const recientes = polizas.slice(0, 5);
      setPolizasRecientes(recientes);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor || 0);
  };

  const formatoFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Pólizas</h1>
        <p>Resumen de actividad y estadísticas</p>
      </div>
      {error && (
        <div className="alert alert-warning">
           {error}
          <button onClick={cargarDatos} className="btn-recargar">Reintentar</button>
        </div>
      )}
      {cargando ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-content">
                <p className="stat-label">Total de Clientes</p>
                <p className="stat-value">{stats.totalClientes}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-content">
                <p className="stat-label">Pólizas Calculadas</p>
                <p className="stat-value">{stats.polizasCalculadas}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-content">
                <p className="stat-label">Recaudo Total</p>
                <p className="stat-value">{formatoMoneda(stats.recaudoTotal)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-content">
                <p className="stat-label">Clientes Activos</p>
                <p className="stat-value">{stats.clientesActivos}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-sections">
            <div className="recent-section">
              <div className="section-header">
                <h2>Pólizas Recientes</h2>
                <Link to="/calcular" className="btn-secondary">Nueva Póliza</Link>
              </div>
              {polizasRecientes.length === 0 ? (
                <div className="empty-message">
                  <p>No hay pólizas calculadas aún</p>
                  <Link to="/calcular" className="btn-primary">Calcular Primera Póliza</Link>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Modelo</th>
                        <th>Costo</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polizasRecientes.map((poliza) => (
                        <tr key={poliza.id}>
                          <td className="client-name">{poliza.nombrePropietario}</td>
                          <td>{poliza.modeloAutomovil}</td>
                          <td className="amount">{formatoMoneda(poliza.costoPoliza)}</td>
                          <td className="date">{formatoFecha(poliza.fechaCalculo)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="quick-actions">
              <h2>Acciones Rápidas</h2>
              <div className="action-buttons">
                <Link to="/calcular" className="btn-action">
                  <span className="btn-icon"></span>
                  <span className="btn-text">Calcular Póliza</span>
                </Link>
                <Link to="/clientes" className="btn-action">
                  <span className="btn-icon"></span>
                  <span className="btn-text">Ver Clientes</span>
                </Link>
                <button onClick={cargarDatos} className="btn-action">
                  <span className="btn-icon"></span>
                  <span className="btn-text">Actualizar Datos</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
