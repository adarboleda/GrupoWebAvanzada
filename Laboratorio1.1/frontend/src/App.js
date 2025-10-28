/**
 * VISTA - Aplicación Principal React
 * Componente principal que integra todos los componentes de la vista
 * Arquitectura MVC - Capa VISTA
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import FormularioVenta from './components/FormularioVenta';
import EstadisticasVentas from './components/EstadisticasVentas';
import TablaVentas from './components/TablaVentas';
import { obtenerVentas, obtenerEstadisticas } from './services/api';

function App() {
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar todas las ventas y estadísticas
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const ventasData = await obtenerVentas();
      const estadisticasData = await obtenerEstadisticas();
      
      setVentas(ventasData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos. Verifica que el servidor esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏪 Tiki Taka - Sistema de Ventas</h1>
        <p className="subtitle">Arquitectura MVC: React + Node.js + MySQL</p>
      </header>

      <main className="App-main">
        {/* VISTA: Formulario para registrar ventas */}
        <section className="section">
          <FormularioVenta onVentaCreada={cargarDatos} />
        </section>

        {/* VISTA: Estadísticas de ventas */}
        <section className="section">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            estadisticas && <EstadisticasVentas estadisticas={estadisticas} />
          )}
        </section>

        {/* VISTA: Tabla de ventas */}
        <section className="section">
          <TablaVentas ventas={ventas} onActualizar={cargarDatos} />
        </section>
      </main>

      <footer className="App-footer">
        <p>
          <strong>Flujo de datos MVC:</strong> Vista (React) ↔ Controlador (API REST) ↔ Modelo (MySQL)
        </p>
      </footer>
    </div>
  );
}

export default App;
