import { Router } from "express";
import { procesarVentas } from "../controller/ventasController.js";

const router = Router();

// POST / -> enviar arreglo de montos: { ventas: [100, 200, 1500] }
router.post("/", procesarVentas);

export default router;
