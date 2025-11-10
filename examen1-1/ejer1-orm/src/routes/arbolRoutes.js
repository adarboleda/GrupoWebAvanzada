import express from 'express';
import {
  crearArbol,
  obtenerArboles,
  obtenerArbolPorId,
  actualizarArbol,
  eliminarArbol,
} from '../controllers/arbolController.js';

const router = express.Router();

router.post('/', crearArbol);
router.get('/', obtenerArboles);
router.get('/:id', obtenerArbolPorId);
router.put('/:id', actualizarArbol);
router.delete('/:id', eliminarArbol);

export default router;
