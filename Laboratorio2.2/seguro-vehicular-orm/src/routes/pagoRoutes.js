import express from 'express';
import {
  procesarPago,
  obtenerPagos,
  obtenerPagoPorId,
  obtenerPagosPorCotizacion,
  reintentarPago,
  eliminarPago,
} from '../controllers/pagoController.js';

const router = express.Router();

// Rutas de Pago
router.post('/procesar', procesarPago); // Procesar pago de cotización
router.get('/', obtenerPagos); // Obtener todos los pagos
router.get('/:id', obtenerPagoPorId); // Obtener pago por ID
router.get('/cotizacion/:id_cotizacion', obtenerPagosPorCotizacion); // Pagos por cotización
router.post('/reintentar/:id_pago', reintentarPago); // Reintentar pago fallido
router.delete('/:id', eliminarPago); // Eliminar pago

export default router;
