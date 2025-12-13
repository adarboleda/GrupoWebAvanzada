import { Conductor } from '../models/conductor.js';

// Función auxiliar para calcular edad
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};

// Crear nuevo conductor
export const crearConductor = async (req, res) => {
  try {
    const {
      identificacion,
      nombre_completo,
      fecha_nacimiento,
      email,
      numero_accidentes,
    } = req.body;

    // Validar que la fecha de nacimiento esté presente
    if (!fecha_nacimiento) {
      return res.status(400).json({
        error: 'La fecha de nacimiento es obligatoria',
      });
    }

    // Calcular edad
    const edad = calcularEdad(fecha_nacimiento);

    // Validar edad mínima (18 años)
    if (edad < 18) {
      return res.status(400).json({
        error: 'El conductor debe ser mayor de 18 años',
        edad_actual: edad,
      });
    }

    // Advertencia si es mayor de 75 años (puede ser rechazado en cotización)
    if (edad > 75) {
      return res.status(400).json({
        error:
          'El conductor supera los 75 años. Las cotizaciones pueden ser rechazadas automáticamente.',
        edad_actual: edad,
      });
    }

    const nuevoConductor = await Conductor.create({
      identificacion,
      nombre_completo,
      fecha_nacimiento,
      email,
      numero_accidentes: numero_accidentes || 0,
    });

    // Mensaje adicional según edad
    let mensaje = 'Conductor registrado exitosamente';
    if (edad >= 18 && edad <= 24) {
      mensaje +=
        '. Nota: Se aplicará recargo por conductor joven en cotizaciones.';
    } else if (edad > 65) {
      mensaje +=
        '. Nota: Se aplicará recargo por edad avanzada o restricciones en cotizaciones.';
    }

    res.status(201).json({
      mensaje,
      conductor: nuevoConductor,
      edad_calculada: edad,
    });
  } catch (error) {
    console.error('Error al crear conductor:', error);
    res.status(500).json({
      error: 'Error al crear el conductor',
      detalle: error.message,
    });
  }
};

// Obtener todos los conductores
export const obtenerConductores = async (req, res) => {
  try {
    const conductores = await Conductor.findAll();

    // Agregar edad calculada a cada conductor
    const conductoresConEdad = conductores.map((conductor) => {
      const edad = calcularEdad(conductor.fecha_nacimiento);
      return {
        ...conductor.toJSON(),
        edad_calculada: edad,
      };
    });

    res.status(200).json(conductoresConEdad);
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    res.status(500).json({
      error: 'Error al obtener los conductores',
      detalle: error.message,
    });
  }
};

// Obtener conductor por ID
export const obtenerConductorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);

    if (!conductor) {
      return res.status(404).json({
        error: 'Conductor no encontrado',
      });
    }

    const edad = calcularEdad(conductor.fecha_nacimiento);

    res.status(200).json({
      ...conductor.toJSON(),
      edad_calculada: edad,
    });
  } catch (error) {
    console.error('Error al obtener conductor:', error);
    res.status(500).json({
      error: 'Error al obtener el conductor',
      detalle: error.message,
    });
  }
};

// Actualizar conductor
export const actualizarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      identificacion,
      nombre_completo,
      fecha_nacimiento,
      email,
      numero_accidentes,
    } = req.body;

    const conductor = await Conductor.findByPk(id);

    if (!conductor) {
      return res.status(404).json({
        error: 'Conductor no encontrado',
      });
    }

    // Si se actualiza la fecha de nacimiento, validar edad
    if (fecha_nacimiento) {
      const edad = calcularEdad(fecha_nacimiento);

      if (edad < 18) {
        return res.status(400).json({
          error: 'El conductor debe ser mayor de 18 años',
          edad_actual: edad,
        });
      }

      if (edad > 75) {
        return res.status(400).json({
          error:
            'El conductor supera los 75 años. Las cotizaciones pueden ser rechazadas automáticamente.',
          edad_actual: edad,
        });
      }
    }

    await conductor.update({
      identificacion,
      nombre_completo,
      fecha_nacimiento,
      email,
      numero_accidentes,
    });

    const edadActual = calcularEdad(conductor.fecha_nacimiento);

    res.status(200).json({
      mensaje: 'Conductor actualizado exitosamente',
      conductor,
      edad_calculada: edadActual,
    });
  } catch (error) {
    console.error('Error al actualizar conductor:', error);
    res.status(500).json({
      error: 'Error al actualizar el conductor',
      detalle: error.message,
    });
  }
};

// Eliminar conductor
export const eliminarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);

    if (!conductor) {
      return res.status(404).json({
        error: 'Conductor no encontrado',
      });
    }

    await conductor.destroy();

    res.status(200).json({
      mensaje: 'Conductor eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar conductor:', error);
    res.status(500).json({
      error: 'Error al eliminar el conductor',
      detalle: error.message,
    });
  }
};

// Función auxiliar exportada para usar en otros controladores
export const validarEdadConductor = (fechaNacimiento) => {
  const edad = calcularEdad(fechaNacimiento);
  return {
    edad,
    esValido: edad >= 18 && edad <= 75,
    esMenor18: edad < 18,
    esJoven: edad >= 18 && edad <= 24,
    esRiesgoEstandar: edad >= 25 && edad <= 65,
    esMayor65: edad > 65,
    esMayor75: edad > 75,
  };
};
