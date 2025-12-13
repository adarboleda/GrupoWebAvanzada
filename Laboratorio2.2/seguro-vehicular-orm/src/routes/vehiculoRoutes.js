import express from 'express';
import {
  crearVehiculo,
  obtenerVehiculos,
  obtenerVehiculoPorId,
  actualizarVehiculo,
  eliminarVehiculo,
} from '../controllers/vehiculoController.js';

const router = express.Router();

// Rutas CRUD de Vehículo
router.post('/', crearVehiculo); // Crear vehículo
router.get('/', obtenerVehiculos); // Obtener todos los vehículos
router.get('/:id', obtenerVehiculoPorId); // Obtener vehículo por ID
router.put('/:id', actualizarVehiculo); // Actualizar vehículo
router.delete('/:id', eliminarVehiculo); // Eliminar vehículo

export default router;
