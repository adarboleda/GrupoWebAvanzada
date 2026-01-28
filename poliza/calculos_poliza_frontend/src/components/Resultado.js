import React from 'react';
import './Resultado.css';

const Resultado = ({ resultado, formData, onNuevoCalculo }) => {
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  const obtenerDescripcionModelo = (modelo) => {
    const modelos = {
      'A': 'Económico',
      'B': 'Estándar',
      'C': 'Premium'
    };
    return modelos[modelo] || modelo;
  };

  return (
    <div className="resultado-container">
      <div className="resultado-header">
        <span className="success-icon">✓</span>
        <h2>Cálculo Completado</h2>
      </div>

      <div className="resultado-body">
        <div className="resultado-resumen">
          <div className="resumen-item">
            <span className="label">Propietario:</span>
            <span className="valor">{resultado.propietario}</span>
          </div>
          <div className="resumen-item">
            <span className="label">Edad:</span>
            <span className="valor">{formData.edad} años</span>
          </div>
          <div className="resumen-item">
            <span className="label">Accidentes:</span>
            <span className="valor">{formData.numeroAccidentes}</span>
          </div>
        </div>

        <div className="separador-resultado"></div>

        <div className="resultado-resumen">
          <div className="resumen-item">
            <span className="label">Modelo:</span>
            <span className="valor">{obtenerDescripcionModelo(formData.modelo)} ({formData.modelo})</span>
          </div>
          <div className="resumen-item">
            <span className="label">Valor Vehículo:</span>
            <span className="valor">{formatoMoneda(formData.valor)}</span>
          </div>
        </div>

        <div className="separador-resultado-grueso"></div>

        <div className="resultado-final">
          <p className="costo-label">Costo Total de la Póliza:</p>
          <p className="costo-valor">{formatoMoneda(resultado.costoTotal)}</p>
        </div>
      </div>

      <div className="resultado-footer">
        <button onClick={onNuevoCalculo} className="btn-nuevo-calculo">
          Calcular Otra Póliza
        </button>
      </div>
    </div>
  );
};

export default Resultado;
