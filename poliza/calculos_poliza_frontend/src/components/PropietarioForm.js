import React from 'react';
import './PropietarioForm.css';

const PropietarioForm = ({ formData, handleChange, errores }) => {
  return (
    <div className="seccion">
      <h2 className="seccion-titulo">
        <span className="icono">👤</span>
        Datos del Propietario
      </h2>
      
      <div className="formulario-grid">
        <div className="form-group">
          <label htmlFor="nombre" className="label">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese su nombre completo"
            className={`input ${errores.nombre ? 'input-error' : ''}`}
          />
          {errores.nombre && (
            <span className="error-message">
              <span className="error-icon">✗</span> {errores.nombre}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="edad" className="label">Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            placeholder="18 - 120"
            className={`input ${errores.edad ? 'input-error' : ''}`}
            min="18"
            max="120"
          />
          {errores.edad && (
            <span className="error-message">
              <span className="error-icon">✗</span> {errores.edad}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="numeroAccidentes" className="label">Número de Accidentes</label>
          <input
            type="number"
            id="numeroAccidentes"
            name="numeroAccidentes"
            value={formData.numeroAccidentes}
            onChange={handleChange}
            placeholder="0 o más"
            className={`input ${errores.numeroAccidentes ? 'input-error' : ''}`}
            min="0"
          />
          {errores.numeroAccidentes && (
            <span className="error-message">
              <span className="error-icon">✗</span> {errores.numeroAccidentes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropietarioForm;
