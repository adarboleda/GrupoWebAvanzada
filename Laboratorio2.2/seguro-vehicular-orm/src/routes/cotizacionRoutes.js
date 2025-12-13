import express from 'express';
import {
  calcularCotizacion,
  obtenerCotizaciones,
  obtenerCotizacionPorId,
  actualizarEstadoCotizacion,
  eliminarCotizacion,
  obtenerCotizacionesPorConductor,
} from '../controllers/cotizacionController.js';

const router = express.Router();

// Rutas de Cotización
router.post('/calcular', calcularCotizacion); // Calcular nueva cotización
router.get('/', obtenerCotizaciones); // Obtener todas las cotizaciones
router.get('/:id', obtenerCotizacionPorId); // Obtener cotización por ID
router.put('/:id/estado', actualizarEstadoCotizacion); // Actualizar estado
router.delete('/:id', eliminarCotizacion); // Eliminar cotización
router.get('/conductor/:id_conductor', obtenerCotizacionesPorConductor); // Cotizaciones por conductor

export default router;
