import { Router } from "express";
import {
  crearCompra,
  listarCompras,
  obtenerCompra,
  actualizarCompra,
  eliminarCompra,
  calcularDescuentoCompra
} from "../controllers/supermercadoController.js";

const router = Router();

// Definición de rutas básicas
router.post("/", crearCompra);

/*{
  "nombreCliente": "Juan Juanito",
  "montoCompra": 40000,
  "numeroAzar": 50
}*/

router.get("/", listarCompras);
router.get("/:id", obtenerCompra);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

// Ruta especial para calcular descuento
router.get("/:id/descuento", calcularDescuentoCompra);

export default router;
