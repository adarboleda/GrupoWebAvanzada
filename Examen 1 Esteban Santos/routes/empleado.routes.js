import { Router } from "express";
import {
  crearEmpleado,
  listarEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado,
  calcularReajusteSueldo,
  calcularReajusteDirecto,
} from "../Back-end/controllers/empleado.controller.js";

/**
 * Rutas para el módulo de Reajuste de Sueldos
 * Ejercicio 2: Reajuste de sueldos según antigüedad
 * Autor: Esteban Santos
 */

const router = Router();

// Rutas CRUD básicas
router.post("/", crearEmpleado);              // Crear nuevo empleado
router.get("/", listarEmpleados);             // Listar todos los empleados
router.get("/:id", obtenerEmpleadoPorId);     // Obtener empleado por ID
router.put("/:id", actualizarEmpleado);       // Actualizar empleado
router.delete("/:id", eliminarEmpleado);      // Eliminar empleado

// Rutas especiales para calcular reajuste
router.get("/:id/calcular", calcularReajusteSueldo);  // Calcular reajuste de empleado guardado
router.post("/calcular", calcularReajusteDirecto);    // Calcular reajuste sin guardar

export default router;
