import express from 'express';
import {
  crearConductor,
  obtenerConductores,
  obtenerConductorPorId,
  actualizarConductor,
  eliminarConductor,
} from '../controllers/conductorController.js';

const router = express.Router();

// Rutas CRUD de Conductor
router.post('/', crearConductor); // Crear conductor
router.get('/', obtenerConductores); // Obtener todos los conductores
router.get('/:id', obtenerConductorPorId); // Obtener conductor por ID
router.put('/:id', actualizarConductor); // Actualizar conductor
router.delete('/:id', eliminarConductor); // Eliminar conductor

export default router;
