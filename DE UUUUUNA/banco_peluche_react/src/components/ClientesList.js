import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteService from '../services/clienteService';
import './ClientesList.css';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
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

    if (!formData.nombre.trim() || !formData.cedula.trim() || !formData.email.trim()) {
      alert('Nombre, cédula y email son requeridos');
      return;
    }

    try {
      const response = await clienteService.crearCliente(formData);
      if (response.ok) {
        alert(`¡Cliente creado exitosamente!\n\nTu código DEUNA es: ${response.data.codigoDeuna}\n\nGuárdalo para recibir transferencias.`);
        setFormData({ nombre: '', cedula: '', email: '', telefono: '' });
        setShowForm(false);
        cargarClientes();
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert(error.response?.data?.msg || 'Error al crear cliente');
    }
  };

  const handleCancelar = () => {
    setFormData({ nombre: '', cedula: '', email: '', telefono: '' });
    setShowForm(false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de desactivar este cliente?')) {
      try {
        await clienteService.eliminarCliente(id);
        alert('Cliente desactivado exitosamente');
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

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    alert('Código DEUNA copiado al portapapeles');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>🏦 DEUNA - Billetera Digital</h1>
        <div className="header-actions">
          <button
            className="btn-nuevo"
            onClick={() => (showForm ? handleCancelar() : setShowForm(true))}
          >
            {showForm ? 'Cancelar' : '+ Nueva Cuenta'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Crear Nueva Cuenta DEUNA</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Cédula *</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  placeholder="Ej: 1712345678"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ej: juan@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ej: 0991234567"
                />
              </div>
            </div>
            <button type="submit" className="btn-submit">
              Crear Cuenta
            </button>
          </form>
        </div>
      )}

      <div className="clientes-grid">
        {clientes.map((cliente) => (
          <div key={cliente._id} className="cliente-card">
            <div className="card-icon">
              <div className="piggy-icon">💳</div>
            </div>
            <h3>{cliente.nombre}</h3>
            
            <div className="codigo-deuna">
              <span className="label">Código DEUNA:</span>
              <div className="codigo-container">
                <span className="codigo">{cliente.codigoDeuna}</span>
                <button 
                  className="btn-copiar" 
                  onClick={() => copiarCodigo(cliente.codigoDeuna)}
                  title="Copiar código"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="saldo-container">
              <span className="saldo-label">Saldo Disponible</span>
              <span className="saldo-monto">${cliente.saldo?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="card-info">
              <p><strong>Cédula:</strong> {cliente.cedula}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
            </div>

            <div className="card-actions">
              <button className="btn-ver" onClick={() => handleVerDetalle(cliente._id)}>
                💰 Operar
              </button>
              <button className="btn-eliminar" onClick={() => handleEliminar(cliente._id)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientes.length === 0 && (
        <div className="empty-state">
          <p>No hay cuentas registradas</p>
          <button className="btn-nuevo" onClick={() => setShowForm(true)}>
            Crear primera cuenta
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientesList;
