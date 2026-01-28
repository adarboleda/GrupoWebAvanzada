import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Clientes.css';

const Clientes = () => {
  const [polizas, setPolizas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch pólizas on component mount
  useEffect(() => {
    fetchPolizas();
  }, []);

  const fetchPolizas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8087/api/poliza/historial');
      
      // Formatear las pólizas con fecha legible
      const polizasFormateadas = response.data.map(poliza => ({
        ...poliza,
        fecha: poliza.fechaCalculo 
          ? new Date(poliza.fechaCalculo).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : new Date().toLocaleDateString('es-ES')
      }));
      setPolizas(polizasFormateadas);
    } catch (err) {
      console.error('Error fetching pólizas:', err);
      setError('No se pudieron cargar las pólizas. Verifica que el servidor esté activo.');
      setPolizas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecargar = () => {
    fetchPolizas();
  };

  const handleDescargar = (poliza) => {
    const contenido = `
PÓLIZA DE SEGUROS
==================

Propietario: ${poliza.nombrePropietario}
Edad: ${poliza.edad} años
Accidentes: ${poliza.numeroAccidentes}

Vehículo:
- Modelo: ${poliza.modeloAutomovil}
- Valor: $${poliza.valorAutomovil.toLocaleString('es-ES', { minimumFractionDigits: 2 })}

Costo de Póliza: $${poliza.costoPoliza.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
Fecha: ${poliza.fecha}
    `.trim();

    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
    elemento.setAttribute('download', `poliza_${poliza.id}_${new Date().getTime()}.txt`);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  const filteredPolizas = polizas.filter(poliza =>
    poliza.nombrePropietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <div className="header-left">
          <h1>Historial de Pólizas</h1>
          <p className="subtitle">Cotizaciones de pólizas realizadas</p>
        </div>
        <button 
          className="btn-add-client"
          onClick={handleRecargar}
        >
          <span className="btn-icon">🔄</span>
          Recargar
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
          <button className="alert-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por nombre del propietario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="result-count">
          {filteredPolizas.length} póliza{filteredPolizas.length !== 1 ? 's' : ''} encontrada{filteredPolizas.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando historial de pólizas...</p>
        </div>
      ) : (
        <div className="table-container">
          {filteredPolizas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No hay pólizas registradas</h3>
              <p>Las cotizaciones de pólizas aparecerán aquí</p>
            </div>
          ) : (
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Propietario</th>
                  <th>Edad</th>
                  <th>Accidentes</th>
                  <th>Modelo Vehículo</th>
                  <th>Valor Vehículo</th>
                  <th>Costo Póliza</th>
                  <th>Fecha Cálculo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolizas.map(poliza => (
                  <tr key={poliza.id}>
                    <td>
                      <span className="client-name">{poliza.nombrePropietario}</span>
                    </td>
                    <td>
                      {poliza.edad} años
                    </td>
                    <td>
                      <span className={`accident-badge ${poliza.numeroAccidentes > 0 ? 'warning' : 'safe'}`}>
                        {poliza.numeroAccidentes} accidente{poliza.numeroAccidentes !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <span className="model-badge">Modelo {poliza.modeloAutomovil}</span>
                    </td>
                    <td>
                      <span className="value-badge">
                        ${poliza.valorAutomovil.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span className="cost-badge">
                        ${poliza.costoPoliza.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span className="date">{poliza.fecha}</span>
                    </td>
                    <td>
                      <div className="action-buttons-inline">
                        <button
                          className="btn-inline btn-download"
                          onClick={() => handleDescargar(poliza)}
                          title="Descargar póliza"
                        >
                          ⬇ Descargar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="clientes-footer">
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total de Pólizas</span>
            <span className="stat-value">{polizas.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Edad Promedio</span>
            <span className="stat-value">
              {polizas.length > 0 
                ? Math.round(polizas.reduce((sum, p) => sum + p.edad, 0) / polizas.length)
                : 0
              }
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Recaudo Total</span>
            <span className="stat-value">
              ${polizas.reduce((sum, p) => sum + p.costoPoliza, 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
