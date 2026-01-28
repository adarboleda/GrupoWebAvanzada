import React from 'react';
import './AutomovilForm.css';

const AutomovilForm = ({ formData, handleChange, errores }) => {
  return (
    <div className="seccion">
      <h2 className="seccion-titulo">
        <span className="icono">🚗</span>
        Datos del Vehículo
      </h2>
      
      <div className="formulario-grid">
        <div className="form-group">
          <label htmlFor="modelo" className="label">Modelo del Vehículo</label>
          <select
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={`input select ${errores.modelo ? 'input-error' : ''}`}
          >
            <option value="A">Modelo A - Económico</option>
            <option value="B">Modelo B - Estándar</option>
            <option value="C">Modelo C - Premium</option>
          </select>
          {errores.modelo && (
            <span className="error-message">
              <span className="error-icon">✗</span> {errores.modelo}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="valor" className="label">Valor del Vehículo ($)</label>
          <input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0.00"
            className={`input ${errores.valor ? 'input-error' : ''}`}
            min="0.01"
            step="0.01"
          />
          {errores.valor && (
            <span className="error-message">
              <span className="error-icon">✗</span> {errores.valor}
            </span>
          )}
        </div>
      </div>

      <div className="info-modelos">
        <p className="info-titulo">Información de Modelos:</p>
        <ul className="info-lista">
          <li><strong>Modelo A:</strong> Vehículos económicos (1.1% del valor)</li>
          <li><strong>Modelo B:</strong> Vehículos estándar (1.2% del valor)</li>
          <li><strong>Modelo C:</strong> Vehículos premium (1.5% del valor)</li>
        </ul>
      </div>
    </div>
  );
};

export default AutomovilForm;
