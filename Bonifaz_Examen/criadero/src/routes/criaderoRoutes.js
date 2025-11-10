import { Router } from 'express';
import { 
    crearCompra, 
    obtenerTodasCompras,
    obtenerCompraPorId,
    actualizarCompra,
    eliminarCompra
} from "../controller/criaderoController.js";

const router = Router();

router.post("/", crearCompra);
router.get("/", obtenerTodasCompras);
router.get("/:id", obtenerCompraPorId);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

export default router;
