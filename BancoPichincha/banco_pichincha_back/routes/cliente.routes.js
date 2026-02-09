import express from 'express';
import ClienteController from '../controllers/cliente.controller.js';

const router = express.Router();

// Autenticación
router.post('/login', ClienteController.login);
router.post('/registro', ClienteController.crear);

// Estadísticas generales
router.get('/estadisticas', ClienteController.obtenerEstadisticas);

// Buscar cliente por código DEUNA (para verificar antes de transferir)
router.get('/codigo/:codigo', ClienteController.buscarPorCodigo);

// CRUD de clientes
router.post('/', ClienteController.crear);
router.get('/', ClienteController.obtenerTodos);
router.get('/:id', ClienteController.obtenerPorId);
router.put('/:id', ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

// Operaciones DEUNA
router.post('/:id/depositar', ClienteController.depositar);
router.post('/:id/transferir', ClienteController.transferir);

// Nuevos servicios DEUNA
router.post('/:id/recarga', ClienteController.recarga); // SERVICIO RECARGA
router.post('/:id/transferir-deuna', ClienteController.transferirDeuna); // SERVICIO TRANSFERIR

// Servicios QR / Solicitud de Cobro
router.post('/:id/generar-qr', ClienteController.generarQR); // Generar solicitud de cobro
router.post('/:id/pagar-qr', ClienteController.pagarQR); // Pagar solicitud de cobro
router.get('/:id/solicitudes-cobro', ClienteController.obtenerSolicitudesCobro); // Ver solicitudes pendientes

// Reversión de transacciones
router.post(
  '/transacciones/:transaccionId/reversar',
  ClienteController.reversarTransaccion,
);

router.get('/:id/transacciones', ClienteController.obtenerTransacciones);
router.post('/:id/regenerar-codigo', ClienteController.regenerarCodigo);

export default router;
