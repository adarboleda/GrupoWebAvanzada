import express from 'express';
import {
  login,
  verificarToken,
  crearUsuario,
  obtenerPerfil,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/authController.js';
import { autenticar, esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/verificar', verificarToken);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', autenticar, obtenerPerfil);

// Rutas de gestión de usuarios (solo para administradores)
router.get('/usuarios', autenticar, esAdmin, listarUsuarios);
router.get('/usuarios/:id', autenticar, esAdmin, obtenerUsuarioPorId);
router.post('/usuarios', autenticar, esAdmin, crearUsuario);
router.put('/usuarios/:id', autenticar, esAdmin, actualizarUsuario);
router.delete('/usuarios/:id', autenticar, esAdmin, eliminarUsuario);

export default router;
