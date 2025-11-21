import express from 'express';
import ClienteController from '../controllers/cliente.controller.js';

const router = express.Router();

// CRUD completo de clientes
router.post('/', ClienteController.crear);
router.get('/', ClienteController.obtenerTodos);
router.get('/estadisticas', ClienteController.obtenerEstadisticas);
router.get('/:id', ClienteController.obtenerPorId);
router.put('/:id', ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

// Endpoint legacy para calcular sin guardar
router.post('/calcular', ClienteController.calcular);

export default router;
