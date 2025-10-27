import { Router } from "express";
import {
  crearDescuento,
  listarDescuentos,
  obtenerDescuentoPorId,
  actualizarDescuento,
  eliminarDescuento,
  calcularDescuentoCompra,
} from "../controller/descuentoController.js";

const router = Router();

// Definición de rutas básicas CRUD
router.post("/", crearDescuento);
router.get("/", listarDescuentos);
router.get("/:id", obtenerDescuentoPorId);
router.put("/:id", actualizarDescuento);
router.delete("/:id", eliminarDescuento);

// Ruta especial para calcular el descuento de una compra
router.get("/:id/calcular", calcularDescuentoCompra);

export default router;
