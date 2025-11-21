import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import { exportarClientesPDF, exportarClientesExcel } from '../services/exportService';
import './ClientesList.css';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    saldoAnterior: 0,
    montoCompras: 0,
    pagoRealizado: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await clienteService.obtenerClientes();
      if (response.ok) {
        setClientes(response.data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      alert('Error al cargar clientes. Asegúrate de que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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
      if (editMode) {
        const response = await clienteService.actualizarCliente(editingId, formData);
        if (response.ok) {
          alert('Cliente actualizado exitosamente');
          setFormData({
            nombre: '',
            saldoAnterior: 0,
            montoCompras: 0,
            pagoRealizado: 0,
          });
          setShowForm(false);
          setEditMode(false);
          setEditingId(null);
          cargarClientes();
        }
      } else {
        const response = await clienteService.crearCliente(formData);
        if (response.ok) {
          alert('Cliente creado exitosamente');
          setFormData({
            nombre: '',
            saldoAnterior: 0,
            montoCompras: 0,
            pagoRealizado: 0,
          });
          setShowForm(false);
          cargarClientes();
        }
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar cliente');
    }
  };

  const handleEditar = (cliente) => {
    setFormData({
      nombre: cliente.nombre,
      saldoAnterior: cliente.saldoAnterior,
      montoCompras: cliente.montoCompras,
      pagoRealizado: cliente.pagoRealizado,
    });
    setEditingId(cliente._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleCancelar = () => {
    setFormData({
      nombre: '',
      saldoAnterior: 0,
      montoCompras: 0,
      pagoRealizado: 0,
    });
    setShowForm(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await clienteService.eliminarCliente(id);
        alert('Cliente eliminado exitosamente');
        cargarClientes();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar cliente');
      }
    }
  };

  const handleVerDetalle = (id) => {
    navigate(`/cliente/${id}`);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Mis productos</h1>
        <div className="header-actions">
          <button
            className="btn-nuevo"
            onClick={() => (showForm ? handleCancelar() : setShowForm(true))}
          >
            {showForm ? 'Cancelar' : 'Solicitar nuevo cliente'}
          </button>
          <button className="btn-export" onClick={() => exportarClientesPDF(clientes)}>
            Exportar PDF
          </button>
          <button className="btn-export" onClick={() => exportarClientesExcel(clientes)}>
            Exportar Excel
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editMode ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-submit">
              {editMode ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </form>
        </div>
      )}

      <div className="clientes-grid">
        {clientes.map((cliente) => (
          <div key={cliente._id} className={`cliente-card ${cliente.esMoroso ? 'moroso' : ''}`}>
            <div className="card-icon">
              <div className="piggy-icon">🏦</div>
            </div>
            <h3>{cliente.nombre}</h3>
            {cliente.esMoroso && <span className="badge-moroso">MOROSO</span>}
            <div className="card-details">
              <p>
                <strong>Saldo Actual:</strong> ${cliente.saldoActual.toFixed(2)}
              </p>
              <p>
                <strong>Pago Mínimo:</strong> ${cliente.pagoMinimo.toFixed(2)}
              </p>
              <p>
                <strong>Estado:</strong> {cliente.esMoroso ? 'Moroso' : 'Al día'}
              </p>
            </div>
            <div className="card-actions">
              <button className="btn-ver" onClick={() => handleVerDetalle(cliente._id)}>
                Ver detalle
              </button>
              <button className="btn-editar" onClick={() => handleEditar(cliente)}>
                Editar
              </button>
              <button className="btn-eliminar" onClick={() => handleEliminar(cliente._id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientes.length === 0 && (
        <div className="empty-state">
          <p>No hay clientes registrados</p>
          <button className="btn-nuevo" onClick={() => setShowForm(true)}>
            Agregar primer cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientesList;
