import { Router } from "express";
import {
  crearEstudiante,
  listarEstudiantes,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  eliminarEstudiante,
} from "../controllers/estudianteController.js";

const router = Router();

// Definición de rutas básicas
router.post("/", crearEstudiante);
router.get("/", listarEstudiantes);
router.get("/:id", obtenerEstudiantePorId);
router.put("/:id", actualizarEstudiante);
router.delete("/:id", eliminarEstudiante);

export default router;
