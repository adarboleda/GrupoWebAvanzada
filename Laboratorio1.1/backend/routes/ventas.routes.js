/**
 * RUTAS - Definición de endpoints de la API REST
 * Conecta las rutas HTTP con los métodos del controlador
 */

const express = require('express');
const router = express.Router();
const VentasController = require('../controllers/VentasController');

// Rutas para las ventas

// POST /api/ventas - Crear nueva venta
router.post('/ventas', VentasController.crearVenta);

// GET /api/ventas - Obtener todas las ventas
router.get('/ventas', VentasController.obtenerVentas);

// GET /api/ventas/estadisticas - Obtener estadísticas
router.get('/ventas/estadisticas', VentasController.obtenerEstadisticas);

// GET /api/ventas/tipo/:tipo - Obtener ventas por tipo
router.get('/ventas/tipo/:tipo', VentasController.obtenerVentasPorTipo);

// GET /api/ventas/:id - Obtener una venta por ID
router.get('/ventas/:id', VentasController.obtenerVentaPorId);

// PUT /api/ventas/:id - Actualizar una venta
router.put('/ventas/:id', VentasController.actualizarVenta);

// DELETE /api/ventas/:id - Eliminar una venta por ID
router.delete('/ventas/:id', VentasController.eliminarVenta);

// DELETE /api/ventas - Eliminar todas las ventas
router.delete('/ventas', VentasController.eliminarVentas);

module.exports = router;
