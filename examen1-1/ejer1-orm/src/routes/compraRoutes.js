import express from 'express';
import {
  crearCompra,
  obtenerCompras,
  obtenerCompraPorId,
  eliminarCompra,
} from '../controllers/compraController.js';

const router = express.Router();

router.post('/', crearCompra);
router.get('/', obtenerCompras);
router.get('/:id', obtenerCompraPorId);
router.delete('/:id', eliminarCompra);

export default router;
