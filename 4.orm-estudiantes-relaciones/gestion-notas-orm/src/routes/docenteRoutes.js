import { Router } from "express";
import {
  crearDocente,
  listarDocentes,
  obtenerDocentePorId,
  actualizarDocente,
  eliminarDocente,
} from "../controllers/docenteController.js";

const router = Router();

// Definición de rutas CRUD para docentes
router.post("/", crearDocente);
router.get("/", listarDocentes);
router.get("/:id", obtenerDocentePorId);
router.put("/:id", actualizarDocente);
router.delete("/:id", eliminarDocente);

export default router;
