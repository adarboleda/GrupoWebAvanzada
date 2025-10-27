import express from "express";
import { mostrarFormulario, calcularDescuento } from "../Controllers/descuentoController.js";

const router = express.Router();

router.get("/descuento", mostrarFormulario);
router.post("/descuento/calcular", calcularDescuento);

export default router;
