import React, { useState } from 'react';
import axios from 'axios';
import './CalculadoraPoliza.css';
import PropietarioForm from './PropietarioForm';
import AutomovilForm from './AutomovilForm';
import Resultado from './Resultado';

const CalculadoraPoliza = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    numeroAccidentes: '',
    valor: '',
    modelo: 'A'
  });

  const [resultado, setResultado] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handleChangePropietario = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo si existe
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleChangeAutomovil = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo si existe
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar edad
    if (!formData.edad) {
      nuevosErrores.edad = 'La edad es requerida';
    } else {
      const edad = parseInt(formData.edad);
      if (isNaN(edad)) {
        nuevosErrores.edad = 'La edad debe ser un número válido';
      } else if (edad < 18) {
        nuevosErrores.edad = 'La edad mínima es 18 años';
      } else if (edad > 120) {
        nuevosErrores.edad = 'La edad no puede ser mayor a 120 años';
      }
    }

    // Validar número de accidentes
    if (formData.numeroAccidentes === '') {
      nuevosErrores.numeroAccidentes = 'El número de accidentes es requerido';
    } else {
      const accidentes = parseInt(formData.numeroAccidentes);
      if (isNaN(accidentes) || accidentes < 0) {
        nuevosErrores.numeroAccidentes = 'El número de accidentes no puede ser negativo';
      }
    }

    // Validar valor
    if (!formData.valor) {
      nuevosErrores.valor = 'El valor del vehículo es requerido';
    } else {
      const valor = parseFloat(formData.valor);
      if (isNaN(valor) || valor <= 0) {
        nuevosErrores.valor = 'El valor debe ser mayor a 0';
      }
    }

    // Validar modelo
    if (!formData.modelo) {
      nuevosErrores.modelo = 'El modelo es requerido';
    } else if (!['A', 'B', 'C'].includes(formData.modelo)) {
      nuevosErrores.modelo = 'El modelo debe ser A, B o C';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setMostrarResultado(false);

    try {
      const response = await axios.post('/api/poliza/calcular', {
        nombre: formData.nombre,
        edad: parseInt(formData.edad),
        numeroAccidentes: parseInt(formData.numeroAccidentes),
        valor: parseFloat(formData.valor),
        modelo: formData.modelo
      });

      setResultado(response.data);
      setMostrarResultado(true);
    } catch (error) {
      console.error('Error detallado:', error);
      
      let mensajeError = 'Error al calcular la póliza';
      
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.data && error.response.data.message) {
          mensajeError = error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          // Mostrar errores de validación
          const erroresValidacion = error.response.data.errors;
          mensajeError = Object.entries(erroresValidacion)
            .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
            .join('; ');
        } else if (error.response.status === 400) {
          mensajeError = 'Datos inválidos. Por favor, verifica los campos del formulario.';
        } else if (error.response.status === 500) {
          mensajeError = 'Error del servidor. Intenta nuevamente.';
        }
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        mensajeError = 'Error de conexión con el servidor. Verifica que el backend esté activo en http://localhost:8087';
      } else {
        mensajeError = error.message;
      }
      
      setErrores({ general: mensajeError });
      setMostrarResultado(false);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevoCalculo = () => {
    setFormData({
      nombre: '',
      edad: '',
      numeroAccidentes: '',
      valor: '',
      modelo: 'A'
    });
    setErrores({});
    setResultado(null);
    setMostrarResultado(false);
  };

  return (
    <div className="calculadora-container">
      <div className="calculadora-card">
        <h1 className="titulo-principal">Calculadora de Póliza de Seguros</h1>
        
        {!mostrarResultado ? (
          <form onSubmit={handleSubmit} className="formulario">
            {errores.general && (
              <div className="error-general">
                <span className="error-icon">⚠️</span>
                {errores.general}
              </div>
            )}

            <PropietarioForm 
              formData={formData}
              handleChange={handleChangePropietario}
              errores={errores}
            />

            <div className="separador"></div>

            <AutomovilForm 
              formData={formData}
              handleChange={handleChangeAutomovil}
              errores={errores}
            />

            <button 
              type="submit" 
              className="btn-calcular"
              disabled={cargando}
            >
              {cargando ? 'Calculando...' : 'Calcular Póliza'}
            </button>
          </form>
        ) : (
          <Resultado 
            resultado={resultado}
            formData={formData}
            onNuevoCalculo={handleNuevoCalculo}
          />
        )}
      </div>
    </div>
  );
};

export default CalculadoraPoliza;
