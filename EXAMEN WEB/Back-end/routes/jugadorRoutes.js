import express from "express";
import {
  obtenerJugadores,
  obtenerJugadoresPorEquipo,
  obtenerJugadorPorId,
  crearJugador,
  actualizarJugador,
  eliminarJugador,
} from "../controller/jugadorController.js";

const router = express.Router();

// Rutas para jugadores
router.get("/", obtenerJugadores);
router.get("/equipo/:equipoId", obtenerJugadoresPorEquipo);
router.get("/:id", obtenerJugadorPorId);
router.post("/", crearJugador);
router.put("/:id", actualizarJugador);
router.delete("/:id", eliminarJugador);

export default router;
