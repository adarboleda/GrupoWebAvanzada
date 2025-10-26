/**
 * SERVIDOR PRINCIPAL - Express Server
 * Configura y ejecuta el servidor Node.js con Express
 * Implementa el patrón MVC con API REST
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rutas
const ventasRoutes = require('./routes/ventas.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================

// CORS - Permitir peticiones desde el frontend
app.use(cors());

// Body Parser - Parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ==================== RUTAS ====================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Tiki Taka - Sistema de Ventas MVC',
    version: '1.0.0',
    endpoints: {
      'POST /api/ventas': 'Crear nueva venta',
      'GET /api/ventas': 'Obtener todas las ventas',
      'GET /api/ventas/estadisticas': 'Obtener estadísticas',
      'GET /api/ventas/tipo/:tipo': 'Obtener ventas por tipo (A, B, C)',
      'DELETE /api/ventas': 'Eliminar todas las ventas'
    }
  });
});

// Rutas de la API
app.use('/api', ventasRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   🚀 Servidor Tiki Taka iniciado               ║');
  console.log(`║   📡 Puerto: ${PORT}                               ║`);
  console.log(`║   🌐 URL: http://localhost:${PORT}                ║`);
  console.log('║   📊 Arquitectura: MVC                         ║');
  console.log('║   💾 Base de datos: MySQL (XAMPP)              ║');
  console.log('╚════════════════════════════════════════════════╝');
});

module.exports = app;
