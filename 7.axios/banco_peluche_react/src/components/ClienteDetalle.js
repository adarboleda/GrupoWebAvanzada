import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { exportarClienteDetallePDF } from '../services/exportService';
import './ClienteDetalle.css';

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    saldoAnterior: 0,
    montoCompras: 0,
    pagoRealizado: 0,
  });

  useEffect(() => {
    const cargarCliente = async () => {
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
    };

    cargarCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditar = () => {
    setFormData({
      nombre: cliente.nombre,
      saldoAnterior: cliente.saldoAnterior,
      montoCompras: cliente.montoCompras,
      pagoRealizado: cliente.pagoRealizado,
    });
    setEditMode(true);
  };

  const handleCancelar = () => {
    setEditMode(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre del cliente es requerido');
      return;
    }

    if (formData.saldoAnterior < 0) {
      alert('El saldo anterior no puede ser negativo');
      return;
    }

    if (formData.montoCompras < 0) {
      alert('El monto de compras no puede ser negativo');
      return;
    }

    if (formData.pagoRealizado < 0) {
      alert('El pago realizado no puede ser negativo');
      return;
    }

    try {
      const response = await clienteService.actualizarCliente(id, formData);
      if (response.ok) {
        alert('Cliente actualizado exitosamente');
        setCliente(response.data);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert('Error al actualizar cliente');
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
        <h1>Detalle del Cliente</h1>
        <div className="header-actions">
          {!editMode && (
            <>
              <button className="btn-editar-detalle" onClick={handleEditar}>
                Editar Cliente
              </button>
              <button className="btn-export" onClick={() => exportarClienteDetallePDF(cliente)}>
                Descargar PDF
              </button>
            </>
          )}
          {editMode && (
            <>
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detalle-content">
        <div className="cliente-info-card">
          {editMode ? (
            <form onSubmit={handleGuardar} className="form-edicion">
              <h3>Editar Información del Cliente</h3>
              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Saldo Anterior</label>
                  <input
                    type="number"
                    name="saldoAnterior"
                    value={formData.saldoAnterior}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Monto Compras</label>
                  <input
                    type="number"
                    name="montoCompras"
                    value={formData.montoCompras}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Pago Realizado</label>
                  <input
                    type="number"
                    name="pagoRealizado"
                    value={formData.pagoRealizado}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit-detalle">
                Guardar Cambios
              </button>
            </form>
          ) : (
            <>
              <div className="card-header">
                <div className="icon-container">
                  <span className="icon">👤</span>
                </div>
                <div>
                  <h2>{cliente.nombre}</h2>
                  <p className="fecha">
                    Fecha de registro: {new Date(cliente.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {cliente.esMoroso && <span className="badge-moroso-large">CLIENTE MOROSO</span>}
              </div>

              <div className="info-sections">
                <div className="info-section">
                  <h3>Información Básica</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Saldo Anterior</span>
                      <span className="value">${cliente.saldoAnterior.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Monto Compras</span>
                      <span className="value">${cliente.montoCompras.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Pago Realizado</span>
                      <span className="value">${cliente.pagoRealizado.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Saldo Base</span>
                      <span className="value">${cliente.saldoBase.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Cálculos y Estado</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Pago Mínimo Base (15%)</span>
                      <span className="value">${cliente.pagoMinimoBase.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Estado de Pago</span>
                      <span className={`value ${cliente.esMoroso ? 'moroso-text' : 'aldia-text'}`}>
                        {cliente.esMoroso ? 'Moroso' : 'Al día'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Interés (12%)</span>
                      <span className="value">${cliente.interes.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Multa</span>
                      <span className="value">${cliente.multa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section highlight">
                  <h3>Resumen de Cuenta</h3>
                  <div className="info-grid">
                    <div className="info-item large">
                      <span className="label">Saldo Actual</span>
                      <span className="value-large">${cliente.saldoActual.toFixed(2)}</span>
                    </div>
                    <div className="info-item large">
                      <span className="label">Pago Mínimo Requerido (15%)</span>
                      <span className="value-large">${cliente.pagoMinimo.toFixed(2)}</span>
                    </div>
                    <div className="info-item large">
                      <span className="label">Pago Sin Intereses (85%)</span>
                      <span className="value-large">${cliente.pagoNoIntereses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {cliente.esMoroso && (
                <div className="warning-box">
                  <h4>⚠️ Aviso Importante</h4>
                  <p>
                    Este cliente está en estado de morosidad. Se han aplicado los siguientes cargos:
                  </p>
                  <ul>
                    <li>Interés del 12% sobre el saldo base: ${cliente.interes.toFixed(2)}</li>
                    <li>Multa por mora: ${cliente.multa.toFixed(2)}</li>
                  </ul>
                  <p>
                    El pago realizado (${cliente.pagoRealizado.toFixed(2)}) es menor al pago mínimo
                    base requerido (${cliente.pagoMinimoBase.toFixed(2)}).
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalle;
