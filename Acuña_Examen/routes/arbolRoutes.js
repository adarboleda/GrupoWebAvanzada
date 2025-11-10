import { Router } from "express";
import {
  crearArbol,
  listarArboles,
  obtenerArbol,
  actualizarArbol,
  eliminarArbol,
  calcularArboles
} from "../controllers/arbolController.js";

const router = Router();

// Definición de rutas básicas
router.post("/", crearArbol);
router.get("/", listarArboles);
router.get("/:id", obtenerArbol);
router.put("/:id", actualizarArbol);
router.delete("/:id", eliminarArbol);

// Ruta especial para calcular árboles
router.get("/:id/arbol", calcularArboles);

// Ruta para calcular compra (acepta items[] en body)
router.post("/calcular", calcularArboles);

export default router;
