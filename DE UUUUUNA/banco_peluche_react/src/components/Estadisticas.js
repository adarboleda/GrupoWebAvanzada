import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
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

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>📊 Estadísticas DEUNA</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card usuarios">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total de Usuarios</h3>
            <p className="stat-number">{estadisticas.totalClientes}</p>
            <p className="stat-description">Cuentas activas en el sistema</p>
          </div>
        </div>

        <div className="stat-card saldo">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Saldo Total en Plataforma</h3>
            <p className="stat-number">${estadisticas.saldoTotal?.toFixed(2) || '0.00'}</p>
            <p className="stat-description">Suma de todos los saldos</p>
          </div>
        </div>

        <div className="stat-card transacciones-hoy">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Transacciones Hoy</h3>
            <p className="stat-number">{estadisticas.transaccionesHoy}</p>
            <p className="stat-description">Operaciones realizadas hoy</p>
          </div>
        </div>

        <div className="stat-card transacciones-total">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Total Transacciones</h3>
            <p className="stat-number">{estadisticas.totalTransacciones}</p>
            <p className="stat-description">Histórico de operaciones</p>
          </div>
        </div>
      </div>

      <div className="stats-info">
        <h2>¿Cómo funciona DEUNA?</h2>
        <div className="info-cards">
          <div className="info-card">
            <span className="info-icon">1️⃣</span>
            <h4>Crea tu cuenta</h4>
            <p>Regístrate con tu cédula, email y datos personales. Recibirás un código DEUNA único.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">2️⃣</span>
            <h4>Deposita saldo</h4>
            <p>Agrega dinero a tu cuenta para poder realizar transferencias.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">3️⃣</span>
            <h4>Comparte tu código</h4>
            <p>Tu código DEUNA es único. Compártelo para recibir dinero de otros usuarios.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">4️⃣</span>
            <h4>Transfiere fácil</h4>
            <p>Usa el código DEUNA de otra persona para enviarle dinero al instante.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
