import express from 'express';
import {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    obtenerEstadisticas,
    obtenerMorosos,
    obtenerNoMorosos,
    actualizarCliente,
    eliminarCliente
} from '../src/controller/clienteController.js';

const router = express.Router();

// Rutas CRUD básicas
router.post('/', crearCliente);
router.get('/', obtenerClientes);
router.get('/estadisticas', obtenerEstadisticas);
router.get('/morosos', obtenerMorosos);
router.get('/no-morosos', obtenerNoMorosos);
router.get('/:id', obtenerClientePorId);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
