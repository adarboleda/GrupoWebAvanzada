import express from 'express';
import {
  crearEquipo,
  obtenerEquipos,
  obtenerEquipoPorId,
  actualizarEquipo,
  eliminarEquipo,
} from '../controllers/equipoController.js';

const router = express.Router();

// Rutas CRUD de Equipo
router.post('/', crearEquipo); // Crear equipo
router.get('/', obtenerEquipos); // Obtener todos los equipos
router.get('/:id', obtenerEquipoPorId); // Obtener equipo por ID
router.put('/:id', actualizarEquipo); // Actualizar equipo
router.delete('/:id', eliminarEquipo); // Eliminar equipo

export default router;
