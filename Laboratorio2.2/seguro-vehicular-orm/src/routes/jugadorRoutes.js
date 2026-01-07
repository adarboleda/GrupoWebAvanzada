import express from 'express';
import {
  crearJugador,
  obtenerJugadores,
  obtenerJugadorPorId,
  actualizarJugador,
  eliminarJugador,
} from '../controllers/jugadorController.js';

const router = express.Router();

// Rutas CRUD de Jugador
router.post('/', crearJugador); // Crear jugador
router.get('/', obtenerJugadores); // Obtener todos los jugadores (con filtro opcional por equipoId)
router.get('/:id', obtenerJugadorPorId); // Obtener jugador por ID
router.put('/:id', actualizarJugador); // Actualizar jugador
router.delete('/:id', eliminarJugador); // Eliminar jugador

export default router;
