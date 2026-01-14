import { Router } from 'express';
import {
  crearJugador,
  listarJugadores,
  listarJugadoresPorEquipo,
  obtenerJugadorPorId,
  actualizarJugador,
  eliminarJugador,
} from '../controller/jugadorController.js';

const router = Router();

router.post('/', crearJugador);
router.get('/', listarJugadores);
router.get('/equipo/:id_equipo', listarJugadoresPorEquipo);
router.get('/:id', obtenerJugadorPorId);
router.put('/:id', actualizarJugador);
router.delete('/:id', eliminarJugador);

export default router;
