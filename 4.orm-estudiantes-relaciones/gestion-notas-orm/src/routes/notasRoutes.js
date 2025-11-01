import { Router } from "express";
import {
  crearNota,
  listarNotas,
  obtenerNotaPorId,
  actualizarNota,
  eliminarNota,
} from "../controllers/notaController.js";

const router = Router();

// Definición de rutas básicas CRUD
router.post("/", crearNota);
router.get("/", listarNotas);
router.get("/:id", obtenerNotaPorId);
router.put("/:id", actualizarNota);
router.delete("/:id", eliminarNota);

export default router;
