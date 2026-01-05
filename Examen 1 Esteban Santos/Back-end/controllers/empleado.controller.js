import Empleado from "../models/empleado.model.js";

/**
 * Controlador para gestionar las operaciones de reajuste de sueldos
 * Ejercicio 2: Reajuste de sueldos según antigüedad
 * Autor: Esteban Santos
 * 
 * RESPONSABILIDADES DEL CONTROLADOR:
 * - Recibir la antigüedad y el sueldo actual desde la vista
 * - Determinar el porcentaje de reajuste según las condiciones de la tabla
 * - Calcular el nuevo sueldo aplicando el reajuste correspondiente
 * - Validar datos (antigüedad ≥ 0, sueldo positivo)
 */

/**
 * Función auxiliar para calcular el porcentaje de reajuste
 * Esta función contiene toda la lógica de negocio
 */
const determinarPorcentajeReajuste = (antiguedad, sueldoActual) => {
  let porcentajeReajuste;

  // Determinar el porcentaje de reajuste según las reglas
  if (antiguedad > 10 && antiguedad <= 20) {
    // Más de 10 años hasta 20 años (incluye el 20)
    if (sueldoActual <= 300000) {
      porcentajeReajuste = 14;
    } else if (sueldoActual > 300000 && sueldoActual <= 500000) {
      porcentajeReajuste = 12;
    } else {
      porcentajeReajuste = 10;
    }
  } else if (antiguedad <= 10) {
    // Hasta 10 años de antigüedad (incluye el 10)
    if (sueldoActual <= 300000) {
      porcentajeReajuste = 12;
    } else if (sueldoActual > 300000 && sueldoActual <= 500000) {
      porcentajeReajuste = 10;
    } else {
      porcentajeReajuste = 8;
    }
  } else {
    // Para antigüedades mayores a 20 años (no especificado en las reglas)
    throw new Error("No hay regla de reajuste definida para antigüedades mayores a 20 años");
  }

  return porcentajeReajuste;
};

/**
 * Función auxiliar para calcular el nuevo sueldo
 */
const calcularNuevoSueldo = (antiguedad, sueldoActual) => {
  // Determinar el porcentaje de reajuste
  const porcentajeReajuste = determinarPorcentajeReajuste(antiguedad, sueldoActual);
  
  // Calcular el monto del reajuste
  const montoReajuste = Math.round((sueldoActual * porcentajeReajuste) / 100 * 100) / 100;
  
  // Calcular el nuevo sueldo
  const nuevoSueldo = Math.round((sueldoActual + montoReajuste) * 100) / 100;

  return {
    antiguedad: antiguedad,
    sueldoActual: sueldoActual,
    porcentajeReajuste: porcentajeReajuste,
    montoReajuste: montoReajuste,
    nuevoSueldo: nuevoSueldo,
    mensaje: `Empleado con ${antiguedad} año(s) de antigüedad y sueldo de $${sueldoActual.toLocaleString()} recibe ${porcentajeReajuste}% de reajuste`
  };
};

// Crear un nuevo registro de empleado
export const crearEmpleado = async (req, res) => {
  try {
    const { nombreEmpleado, antiguedad, sueldoActual } = req.body;
    
    // Validar que se hayan enviado los datos obligatorios
    if (!nombreEmpleado || antiguedad == null || sueldoActual == null) {
      return res.status(400).json({ 
        success: false,
        error: "Faltan datos obligatorios",
        requeridos: {
          nombreEmpleado: "string",
          antiguedad: "number (años)",
          sueldoActual: "number (monto)"
        }
      });
    }

    // Validar que la antigüedad sea un número no negativo
    if (antiguedad < 0) {
      return res.status(400).json({ 
        success: false,
        error: "La antigüedad no puede ser negativa" 
      });
    }

    // Validar que el sueldo sea mayor a 0
    if (sueldoActual <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "El sueldo debe ser mayor a 0" 
      });
    }

    // Crear el registro en la base de datos
    const nuevoEmpleado = await Empleado.create({
      nombreEmpleado,
      antiguedad,
      sueldoActual,
    });
    
    res.status(201).json({
      success: true,
      message: "Empleado creado exitosamente",
      data: nuevoEmpleado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al crear el empleado", 
      error: error.message 
    });
  }
};

// Listar todos los empleados
export const listarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      order: [['id', 'DESC']] // Ordenar por ID descendente (más recientes primero)
    });
    
    res.json({
      success: true,
      total: empleados.length,
      data: empleados
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al obtener los empleados", 
      error: error.message 
    });
  }
};

// Buscar empleado por ID
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);
    
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        mensaje: "Empleado no encontrado" 
      });
    }
    
    res.json({
      success: true,
      data: empleado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al obtener el empleado", 
      error: error.message 
    });
  }
};

// Actualizar empleado por ID
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreEmpleado, antiguedad, sueldoActual } = req.body;
    
    const empleado = await Empleado.findByPk(id);
    
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        mensaje: "Empleado no encontrado" 
      });
    }

    // Validaciones si se están actualizando los valores
    if (antiguedad != null && antiguedad < 0) {
      return res.status(400).json({ 
        success: false,
        error: "La antigüedad no puede ser negativa" 
      });
    }

    if (sueldoActual != null && sueldoActual <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "El sueldo debe ser mayor a 0" 
      });
    }

    await empleado.update({ nombreEmpleado, antiguedad, sueldoActual });
    
    res.json({
      success: true,
      message: "Empleado actualizado exitosamente",
      data: empleado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al actualizar el empleado", 
      error: error.message 
    });
  }
};

// Eliminar empleado por ID
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);
    
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        mensaje: "Empleado no encontrado" 
      });
    }
    
    await empleado.destroy();
    
    res.json({ 
      success: true,
      mensaje: "Empleado eliminado correctamente" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al eliminar el empleado", 
      error: error.message 
    });
  }
};

/**
 * Calcular reajuste de sueldo
 * Ejercicio 2: Según antigüedad y sueldo actual
 * El CONTROLADOR realiza todos los cálculos
 */
export const calcularReajusteSueldo = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);
    
    if (!empleado) {
      return res.status(404).json({ 
        success: false,
        mensaje: "Empleado no encontrado" 
      });
    }

    // El CONTROLADOR calcula el reajuste (no el modelo)
    const resultado = calcularNuevoSueldo(empleado.antiguedad, parseFloat(empleado.sueldoActual));
    
    res.json({
      success: true,
      empleado: {
        id: empleado.id,
        nombreEmpleado: empleado.nombreEmpleado
      },
      calculo: resultado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al calcular el reajuste", 
      error: error.message 
    });
  }
};

/**
 * Calcular reajuste de sueldo de forma directa (sin guardar en BD)
 * Útil para hacer cálculos rápidos sin persistencia
 * El CONTROLADOR realiza todos los cálculos
 */
export const calcularReajusteDirecto = async (req, res) => {
  try {
    const { nombreEmpleado, antiguedad, sueldoActual } = req.body;
    
    // Validar que se hayan enviado los datos obligatorios
    if (nombreEmpleado == null || antiguedad == null || sueldoActual == null) {
      return res.status(400).json({ 
        success: false,
        error: "Faltan datos obligatorios",
        requeridos: {
          nombreEmpleado: "string",
          antiguedad: "number (años)",
          sueldoActual: "number (monto)"
        }
      });
    }

    // Validar antigüedad
    if (antiguedad < 0) {
      return res.status(400).json({ 
        success: false,
        error: "La antigüedad no puede ser negativa" 
      });
    }

    // Validar sueldo
    if (sueldoActual <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "El sueldo debe ser mayor a 0" 
      });
    }

    // El CONTROLADOR calcula el reajuste directamente
    const resultado = calcularNuevoSueldo(antiguedad, sueldoActual);
    
    res.json({
      success: true,
      empleado: {
        nombreEmpleado: nombreEmpleado
      },
      calculo: resultado
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      mensaje: "Error al calcular el reajuste", 
      error: error.message 
    });
  }
};
