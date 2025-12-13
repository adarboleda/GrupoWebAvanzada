import { Vehiculo } from '../models/vehiculo.js';

// Función auxiliar para validar antigüedad del vehículo
const validarAntiguedad = (anioFabricacion) => {
  const anioActual = new Date().getFullYear();
  const antiguedad = anioActual - anioFabricacion;
  return {
    antiguedad,
    esValido: antiguedad <= 20,
    mensaje:
      antiguedad > 20
        ? `El vehículo tiene ${antiguedad} años. No se permite cotizar vehículos con más de 20 años.`
        : null,
  };
};

// Crear nuevo vehículo
export const crearVehiculo = async (req, res) => {
  try {
    const {
      marca,
      modelo,
      anio_fabricacion,
      placa,
      valor_mercado,
      tipo_vehiculo,
      uso_vehiculo,
    } = req.body;

    // Validar antigüedad
    const validacion = validarAntiguedad(anio_fabricacion);

    if (!validacion.esValido) {
      return res.status(400).json({
        error: validacion.mensaje,
        antiguedad: validacion.antiguedad,
      });
    }

    const nuevoVehiculo = await Vehiculo.create({
      marca,
      modelo,
      anio_fabricacion,
      placa,
      valor_mercado,
      tipo_vehiculo,
      uso_vehiculo,
    });

    // Mensaje informativo según características
    let mensaje = 'Vehículo registrado exitosamente';
    const notas = [];

    if (tipo_vehiculo === 'SUV' || tipo_vehiculo === 'CAMIONETA') {
      notas.push('Costo base incrementado por tipo de vehículo');
    }

    if (uso_vehiculo === 'COMERCIAL') {
      notas.push('Recargo obligatorio por uso comercial');
    }

    res.status(201).json({
      mensaje,
      notas: notas.length > 0 ? notas : undefined,
      vehiculo: nuevoVehiculo,
      antiguedad: validacion.antiguedad,
    });
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({
      error: 'Error al crear el vehículo',
      detalle: error.message,
    });
  }
};

// Obtener todos los vehículos
export const obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();

    // Agregar antigüedad calculada a cada vehículo
    const vehiculosConAntiguedad = vehiculos.map((vehiculo) => {
      const validacion = validarAntiguedad(vehiculo.anio_fabricacion);
      return {
        ...vehiculo.toJSON(),
        antiguedad: validacion.antiguedad,
        puede_cotizar: validacion.esValido,
      };
    });

    res.status(200).json(vehiculosConAntiguedad);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      error: 'Error al obtener los vehículos',
      detalle: error.message,
    });
  }
};

// Obtener vehículo por ID
export const obtenerVehiculoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {
      return res.status(404).json({
        error: 'Vehículo no encontrado',
      });
    }

    const validacion = validarAntiguedad(vehiculo.anio_fabricacion);

    res.status(200).json({
      ...vehiculo.toJSON(),
      antiguedad: validacion.antiguedad,
      puede_cotizar: validacion.esValido,
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      error: 'Error al obtener el vehículo',
      detalle: error.message,
    });
  }
};

// Actualizar vehículo
export const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      marca,
      modelo,
      anio_fabricacion,
      placa,
      valor_mercado,
      tipo_vehiculo,
      uso_vehiculo,
    } = req.body;

    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {
      return res.status(404).json({
        error: 'Vehículo no encontrado',
      });
    }

    // Si se actualiza el año, validar antigüedad
    if (anio_fabricacion) {
      const validacion = validarAntiguedad(anio_fabricacion);

      if (!validacion.esValido) {
        return res.status(400).json({
          error: validacion.mensaje,
          antiguedad: validacion.antiguedad,
        });
      }
    }

    await vehiculo.update({
      marca,
      modelo,
      anio_fabricacion,
      placa,
      valor_mercado,
      tipo_vehiculo,
      uso_vehiculo,
    });

    const validacionActual = validarAntiguedad(vehiculo.anio_fabricacion);

    res.status(200).json({
      mensaje: 'Vehículo actualizado exitosamente',
      vehiculo,
      antiguedad: validacionActual.antiguedad,
      puede_cotizar: validacionActual.esValido,
    });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({
      error: 'Error al actualizar el vehículo',
      detalle: error.message,
    });
  }
};

// Eliminar vehículo
export const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {
      return res.status(404).json({
        error: 'Vehículo no encontrado',
      });
    }

    await vehiculo.destroy();

    res.status(200).json({
      mensaje: 'Vehículo eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({
      error: 'Error al eliminar el vehículo',
      detalle: error.message,
    });
  }
};

// Función auxiliar exportada para usar en otros controladores
export const validarVehiculoParaCotizacion = (vehiculo) => {
  const anioActual = new Date().getFullYear();
  const antiguedad = anioActual - vehiculo.anio_fabricacion;

  return {
    esValido: antiguedad <= 20,
    antiguedad,
    tieneRecargoTipo:
      vehiculo.tipo_vehiculo === 'SUV' ||
      vehiculo.tipo_vehiculo === 'CAMIONETA',
    tieneRecargoComercial: vehiculo.uso_vehiculo === 'COMERCIAL',
  };
};
