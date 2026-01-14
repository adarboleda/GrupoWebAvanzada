import { Router } from 'express';
import {
  crearEquipo,
  listarEquipos,
  obtenerEquipoPorId,
  actualizarEquipo,
  eliminarEquipo,
} from '../controller/equipoController.js';

const router = Router();

router.post('/', crearEquipo);
router.get('/', listarEquipos);
router.get('/:id', obtenerEquipoPorId);
router.put('/:id', actualizarEquipo);
router.delete('/:id', eliminarEquipo);

export default router;
