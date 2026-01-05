import express from "express";
import {
  obtenerEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from "../controller/equipoController.js";

const router = express.Router();

// Rutas para equipos
router.get("/", obtenerEquipos);
router.get("/:id", obtenerEquipoPorId);
router.post("/", crearEquipo);
router.put("/:id", actualizarEquipo);
router.delete("/:id", eliminarEquipo);

export default router;
