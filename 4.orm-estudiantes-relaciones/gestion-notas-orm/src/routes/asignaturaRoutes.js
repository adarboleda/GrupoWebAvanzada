import { Router } from "express";
import {
  crearAsignatura,
  listarAsignaturas,
  obtenerAsignaturaPorId,
  actualizarAsignatura,
  eliminarAsignatura,
} from "../controllers/asignaturaController.js";

const router = Router();

// Definición de rutas CRUD para asignaturas
router.post("/", crearAsignatura);
router.get("/", listarAsignaturas);
router.get("/:id", obtenerAsignaturaPorId);
router.put("/:id", actualizarAsignatura);
router.delete("/:id", eliminarAsignatura);

export default router;
