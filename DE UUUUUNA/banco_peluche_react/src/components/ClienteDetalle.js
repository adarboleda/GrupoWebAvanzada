import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import './ClienteDetalle.css';

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Estados para operaciones
  const [montoDeposito, setMontoDeposito] = useState('');
  const [descripcionDeposito, setDescripcionDeposito] = useState('');
  
  const [codigoDestino, setCodigoDestino] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [descripcionTransferencia, setDescripcionTransferencia] = useState('');
  const [destinatarioInfo, setDestinatarioInfo] = useState(null);
  const [buscandoDestinatario, setBuscandoDestinatario] = useState(false);

  const cargarCliente = useCallback(async () => {
    try {
      const response = await clienteService.obtenerClientePorId(id);
      if (response.ok) {
        setCliente(response.data);
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      alert('Error al cargar cliente');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const cargarTransacciones = useCallback(async () => {
    try {
      const response = await clienteService.obtenerTransacciones(id);
      if (response.ok) {
        setTransacciones(response.data);
      }
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    }
  }, [id]);

  useEffect(() => {
    cargarCliente();
    cargarTransacciones();
  }, [cargarCliente, cargarTransacciones]);

  // Buscar destinatario por código DEUNA
  const buscarDestinatario = async () => {
    if (!codigoDestino || codigoDestino.length < 8) {
      setDestinatarioInfo(null);
      return;
    }

    setBuscandoDestinatario(true);
    try {
      const response = await clienteService.buscarPorCodigo(codigoDestino);
      if (response.ok) {
        setDestinatarioInfo(response.data);
      }
    } catch (error) {
      setDestinatarioInfo(null);
    } finally {
      setBuscandoDestinatario(false);
    }
  };

  // Manejar depósito
  const handleDepositar = async (e) => {
    e.preventDefault();
    
    if (!montoDeposito || parseFloat(montoDeposito) <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    try {
      const response = await clienteService.depositar(id, parseFloat(montoDeposito), descripcionDeposito);
      if (response.ok) {
        alert(response.msg);
        setMontoDeposito('');
        setDescripcionDeposito('');
        cargarCliente();
        cargarTransacciones();
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al realizar depósito');
    }
  };

  // Manejar transferencia
  const handleTransferir = async (e) => {
    e.preventDefault();
    
    if (!codigoDestino) {
      alert('Ingresa el código DEUNA del destinatario');
      return;
    }

    if (!montoTransferencia || parseFloat(montoTransferencia) <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    if (parseFloat(montoTransferencia) > cliente.saldo) {
      alert('Saldo insuficiente');
      return;
    }

    if (!destinatarioInfo) {
      alert('Verifica el código DEUNA del destinatario');
      return;
    }

    const confirmar = window.confirm(
      `¿Confirmas la transferencia de $${parseFloat(montoTransferencia).toFixed(2)} a ${destinatarioInfo.nombre}?`
    );

    if (!confirmar) return;

    try {
      const response = await clienteService.transferir(
        id,
        codigoDestino,
        parseFloat(montoTransferencia),
        descripcionTransferencia
      );
      if (response.ok) {
        alert(response.msg);
        setCodigoDestino('');
        setMontoTransferencia('');
        setDescripcionTransferencia('');
        setDestinatarioInfo(null);
        cargarCliente();
        cargarTransacciones();
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al realizar transferencia');
    }
  };

  // Regenerar código DEUNA
  const handleRegenerarCodigo = async () => {
    const confirmar = window.confirm('¿Seguro que deseas generar un nuevo código DEUNA? El código anterior dejará de funcionar.');
    if (!confirmar) return;

    try {
      const response = await clienteService.regenerarCodigo(id);
      if (response.ok) {
        alert(`Tu nuevo código DEUNA es: ${response.data.codigoDeuna}`);
        cargarCliente();
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al regenerar código');
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(cliente.codigoDeuna);
    alert('Código DEUNA copiado al portapapeles');
  };

  const getTipoTransaccionIcon = (tipo) => {
    switch (tipo) {
      case 'DEPOSITO': return '💵';
      case 'TRANSFERENCIA_ENVIADA': return '📤';
      case 'TRANSFERENCIA_RECIBIDA': return '📥';
      default: return '💰';
    }
  };

  const getTipoTransaccionColor = (tipo) => {
    switch (tipo) {
      case 'DEPOSITO': return 'green';
      case 'TRANSFERENCIA_ENVIADA': return 'red';
      case 'TRANSFERENCIA_RECIBIDA': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!cliente) {
    return <div className="error">Cliente no encontrado</div>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>Mi Cuenta DEUNA</h1>
      </div>

      {/* Tarjeta de cuenta */}
      <div className="cuenta-card">
        <div className="cuenta-info">
          <div className="cuenta-avatar">💳</div>
          <div className="cuenta-datos">
            <h2>{cliente.nombre}</h2>
            <p>{cliente.email}</p>
          </div>
        </div>
        
        <div className="codigo-deuna-grande">
          <span className="label">Tu código DEUNA</span>
          <div className="codigo-row">
            <span className="codigo">{cliente.codigoDeuna}</span>
            <button className="btn-copiar" onClick={copiarCodigo}>📋 Copiar</button>
            <button className="btn-regenerar" onClick={handleRegenerarCodigo}>🔄 Nuevo</button>
          </div>
        </div>

        <div className="saldo-grande">
          <span className="label">Saldo Disponible</span>
          <span className="monto">${cliente.saldo?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'resumen' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumen')}
        >
          📊 Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'depositar' ? 'active' : ''}`}
          onClick={() => setActiveTab('depositar')}
        >
          💵 Depositar
        </button>
        <button 
          className={`tab ${activeTab === 'transferir' ? 'active' : ''}`}
          onClick={() => setActiveTab('transferir')}
        >
          📤 Transferir
        </button>
        <button 
          className={`tab ${activeTab === 'historial' ? 'active' : ''}`}
          onClick={() => setActiveTab('historial')}
        >
          📋 Historial
        </button>
      </div>

      {/* Contenido del tab */}
      <div className="tab-content">
        {activeTab === 'resumen' && (
          <div className="resumen-section">
            <h3>Información de la Cuenta</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nombre</span>
                <span className="value">{cliente.nombre}</span>
              </div>
              <div className="info-item">
                <span className="label">Cédula</span>
                <span className="value">{cliente.cedula}</span>
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                <span className="value">{cliente.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Teléfono</span>
                <span className="value">{cliente.telefono || 'No registrado'}</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha de registro</span>
                <span className="value">{new Date(cliente.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Estado</span>
                <span className="value estado-activo">{cliente.activo ? 'Activa' : 'Inactiva'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'depositar' && (
          <div className="operacion-section">
            <h3>💵 Depositar Saldo</h3>
            <form onSubmit={handleDepositar} className="operacion-form">
              <div className="form-group">
                <label>Monto a depositar ($)</label>
                <input
                  type="number"
                  value={montoDeposito}
                  onChange={(e) => setMontoDeposito(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <input
                  type="text"
                  value={descripcionDeposito}
                  onChange={(e) => setDescripcionDeposito(e.target.value)}
                  placeholder="Ej: Recarga de saldo"
                />
              </div>
              <button type="submit" className="btn-operacion btn-depositar">
                Depositar ${montoDeposito || '0.00'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'transferir' && (
          <div className="operacion-section">
            <h3>📤 Transferir por Código DEUNA</h3>
            <form onSubmit={handleTransferir} className="operacion-form">
              <div className="form-group">
                <label>Código DEUNA del destinatario</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={codigoDestino}
                    onChange={(e) => {
                      setCodigoDestino(e.target.value.toUpperCase());
                      setDestinatarioInfo(null);
                    }}
                    placeholder="Ej: A1B2C3D4"
                    maxLength={8}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={buscarDestinatario}
                    disabled={buscandoDestinatario || codigoDestino.length < 8}
                    className="btn-buscar"
                  >
                    {buscandoDestinatario ? '...' : '🔍 Verificar'}
                  </button>
                </div>
                {destinatarioInfo && (
                  <div className="destinatario-info">
                    ✅ Destinatario: <strong>{destinatarioInfo.nombre}</strong>
                  </div>
                )}
                {codigoDestino.length === 8 && !destinatarioInfo && !buscandoDestinatario && (
                  <div className="destinatario-error">
                    ❌ Código no encontrado
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Monto a transferir ($)</label>
                <input
                  type="number"
                  value={montoTransferencia}
                  onChange={(e) => setMontoTransferencia(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  max={cliente.saldo}
                  required
                />
                <span className="saldo-disponible">
                  Saldo disponible: ${cliente.saldo?.toFixed(2)}
                </span>
              </div>
              <div className="form-group">
                <label>Descripción (opcional)</label>
                <input
                  type="text"
                  value={descripcionTransferencia}
                  onChange={(e) => setDescripcionTransferencia(e.target.value)}
                  placeholder="Ej: Pago de almuerzo"
                />
              </div>
              <button 
                type="submit" 
                className="btn-operacion btn-transferir"
                disabled={!destinatarioInfo || parseFloat(montoTransferencia) > cliente.saldo}
              >
                Transferir ${montoTransferencia || '0.00'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="historial-section">
            <h3>📋 Historial de Transacciones</h3>
            {transacciones.length === 0 ? (
              <p className="sin-transacciones">No hay transacciones registradas</p>
            ) : (
              <div className="transacciones-lista">
                {transacciones.map((tx) => (
                  <div key={tx._id} className="transaccion-item">
                    <div className="tx-icon">{getTipoTransaccionIcon(tx.tipo)}</div>
                    <div className="tx-info">
                      <span className="tx-tipo">{tx.tipo.replace(/_/g, ' ')}</span>
                      <span className="tx-descripcion">{tx.descripcion}</span>
                      <span className="tx-fecha">
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                      <span className="tx-referencia">Ref: {tx.referencia}</span>
                    </div>
                    <div className="tx-monto" style={{ color: getTipoTransaccionColor(tx.tipo) }}>
                      {tx.tipo === 'TRANSFERENCIA_ENVIADA' ? '-' : '+'}${tx.monto.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteDetalle;
