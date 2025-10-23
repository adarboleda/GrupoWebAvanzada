import { Router } from "express";
import {
  crearObrero,
  listarObreros,
  obtenerObreroPorId,
  actualizarObrero,
  eliminarObrero,
  calcularSalarioSemanal,
} from "../controller/obreroController.js";

const router = Router();

// Definición de rutas básicas
router.post("/", crearObrero);
router.get("/", listarObreros);
router.get("/:id", obtenerObreroPorId);
router.put("/:id", actualizarObrero);
router.delete("/:id", eliminarObrero);

// Ruta especial para calcular salario
router.get("/:id/salario", calcularSalarioSemanal);

export default router;
