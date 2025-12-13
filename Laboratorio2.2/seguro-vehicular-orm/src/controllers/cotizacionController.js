import { Cotizacion } from '../models/cotizacion.js';
import { Conductor } from '../models/conductor.js';
import { Vehiculo } from '../models/vehiculo.js';
import { validarEdadConductor } from './conductorController.js';
import { validarVehiculoParaCotizacion } from './vehiculoController.js';

// Constantes para cálculo de seguro
const COSTOS_BASE = {
  SEDAN: 300.0,
  SUV: 450.0,
  CAMIONETA: 450.0,
  OTRO: 350.0,
};

const PORCENTAJES = {
  RECARGO_CONDUCTOR_JOVEN: 0.25, // 25% recargo (18-24 años)
  RECARGO_MAYOR_65: 0.15, // 15% recargo (>65 años)
  RECARGO_USO_COMERCIAL: 0.2, // 20% recargo uso comercial
  RECARGO_POR_ACCIDENTE: 0.1, // 10% por cada accidente
  RECARGO_MAS_3_ACCIDENTES: 0.5, // 50% si tiene más de 3 accidentes
  DESCUENTO_SIN_ACCIDENTES: 0.1, // 10% descuento sin accidentes
  FACTOR_VALOR_VEHICULO: 0.02, // 2% del valor del vehículo se suma al costo
};

const DIAS_VIGENCIA_COTIZACION = 30;

// Calcular cotización
export const calcularCotizacion = async (req, res) => {
  try {
    const { id_conductor, id_vehiculo, acepta_terminos } = req.body;

    // Validar que se acepten los términos
    if (!acepta_terminos) {
      return res.status(400).json({
        error:
          'Debe aceptar los términos y condiciones para generar la cotización',
      });
    }

    // Buscar conductor
    const conductor = await Conductor.findByPk(id_conductor);
    if (!conductor) {
      return res.status(404).json({
        error: 'Conductor no encontrado',
      });
    }

    // Buscar vehículo
    const vehiculo = await Vehiculo.findByPk(id_vehiculo);
    if (!vehiculo) {
      return res.status(404).json({
        error: 'Vehículo no encontrado',
      });
    }

    // Validar edad del conductor
    const validacionEdad = validarEdadConductor(conductor.fecha_nacimiento);

    // Rechazar si es menor de 18
    if (validacionEdad.esMenor18) {
      const cotizacionRechazada = await Cotizacion.create({
        id_conductor,
        id_vehiculo,
        fecha_vencimiento: new Date(
          Date.now() + DIAS_VIGENCIA_COTIZACION * 24 * 60 * 60 * 1000
        ),
        monto_base: 0,
        monto_recargos: 0,
        monto_descuentos: 0,
        monto_total: 0,
        estado: 'RECHAZADA',
        mensaje_rechazo: 'Conductor menor de 18 años',
        acepta_terminos,
      });

      return res.status(400).json({
        error:
          'No se permite generar cotización para conductores menores de 18 años',
        edad: validacionEdad.edad,
        cotizacion: cotizacionRechazada,
      });
    }

    // Rechazar si es mayor de 75
    if (validacionEdad.esMayor75) {
      const cotizacionRechazada = await Cotizacion.create({
        id_conductor,
        id_vehiculo,
        fecha_vencimiento: new Date(
          Date.now() + DIAS_VIGENCIA_COTIZACION * 24 * 60 * 60 * 1000
        ),
        monto_base: 0,
        monto_recargos: 0,
        monto_descuentos: 0,
        monto_total: 0,
        estado: 'RECHAZADA',
        mensaje_rechazo:
          'Conductor mayor de 75 años - Cotización rechazada automáticamente',
        acepta_terminos,
      });

      return res.status(400).json({
        error:
          'La cotización es rechazada automáticamente para conductores mayores de 75 años',
        edad: validacionEdad.edad,
        cotizacion: cotizacionRechazada,
      });
    }

    // Validar vehículo
    const validacionVehiculo = validarVehiculoParaCotizacion(vehiculo);

    if (!validacionVehiculo.esValido) {
      const cotizacionRechazada = await Cotizacion.create({
        id_conductor,
        id_vehiculo,
        fecha_vencimiento: new Date(
          Date.now() + DIAS_VIGENCIA_COTIZACION * 24 * 60 * 60 * 1000
        ),
        monto_base: 0,
        monto_recargos: 0,
        monto_descuentos: 0,
        monto_total: 0,
        estado: 'RECHAZADA',
        mensaje_rechazo: `Vehículo con más de 20 años de antigüedad (${validacionVehiculo.antiguedad} años)`,
        acepta_terminos,
      });

      return res.status(400).json({
        error: 'No se permite cotizar vehículos con más de 20 años',
        antiguedad: validacionVehiculo.antiguedad,
        cotizacion: cotizacionRechazada,
      });
    }

    // --- CÁLCULO DE COTIZACIÓN ---

    // 1. Costo base según tipo de vehículo
    let montoBase = COSTOS_BASE[vehiculo.tipo_vehiculo] || COSTOS_BASE.OTRO;

    // 2. Agregar porcentaje del valor del vehículo
    montoBase +=
      parseFloat(vehiculo.valor_mercado) * PORCENTAJES.FACTOR_VALOR_VEHICULO;

    let montoRecargos = 0;
    let montoDescuentos = 0;
    const detalleCalculo = [];

    // 3. Recargo por edad del conductor
    if (validacionEdad.esJoven) {
      const recargo = montoBase * PORCENTAJES.RECARGO_CONDUCTOR_JOVEN;
      montoRecargos += recargo;
      detalleCalculo.push({
        concepto: 'Recargo por conductor joven (18-24 años)',
        monto: recargo.toFixed(2),
      });
    } else if (validacionEdad.esMayor65) {
      const recargo = montoBase * PORCENTAJES.RECARGO_MAYOR_65;
      montoRecargos += recargo;
      detalleCalculo.push({
        concepto: 'Recargo por edad avanzada (>65 años)',
        monto: recargo.toFixed(2),
      });
    }

    // 4. Recargo por uso comercial
    if (validacionVehiculo.tieneRecargoComercial) {
      const recargo = montoBase * PORCENTAJES.RECARGO_USO_COMERCIAL;
      montoRecargos += recargo;
      detalleCalculo.push({
        concepto: 'Recargo obligatorio por uso comercial',
        monto: recargo.toFixed(2),
      });
    }

    // 5. Recargo por tipo de vehículo (SUV/CAMIONETA)
    if (validacionVehiculo.tieneRecargoTipo) {
      detalleCalculo.push({
        concepto: `Costo base incrementado por ${vehiculo.tipo_vehiculo}`,
        nota: 'Ya incluido en costo base',
      });
    }

    // 6. Manejo de historial de accidentes
    const numeroAccidentes = conductor.numero_accidentes || 0;

    if (numeroAccidentes === 0) {
      // Descuento por buen historial
      const descuento = montoBase * PORCENTAJES.DESCUENTO_SIN_ACCIDENTES;
      montoDescuentos += descuento;
      detalleCalculo.push({
        concepto: 'Descuento por buen historial (sin accidentes)',
        monto: -descuento.toFixed(2),
      });
    } else if (numeroAccidentes > 0 && numeroAccidentes <= 3) {
      // Recargo por cada accidente
      const recargo =
        montoBase * PORCENTAJES.RECARGO_POR_ACCIDENTE * numeroAccidentes;
      montoRecargos += recargo;
      detalleCalculo.push({
        concepto: `Recargo por ${numeroAccidentes} accidente(s)`,
        monto: recargo.toFixed(2),
      });
    } else if (numeroAccidentes > 3) {
      // Más de 3 accidentes: recargo alto
      const recargo = montoBase * PORCENTAJES.RECARGO_MAS_3_ACCIDENTES;
      montoRecargos += recargo;
      detalleCalculo.push({
        concepto: `Recargo alto por ${numeroAccidentes} accidentes (>3)`,
        monto: recargo.toFixed(2),
        advertencia: 'Conductor con alto riesgo',
      });
    }

    // 7. Calcular monto total
    const montoTotal = montoBase + montoRecargos - montoDescuentos;

    // 8. Calcular fecha de vencimiento (30 días)
    const fechaVencimiento = new Date(
      Date.now() + DIAS_VIGENCIA_COTIZACION * 24 * 60 * 60 * 1000
    );

    // 9. Crear la cotización
    const cotizacion = await Cotizacion.create({
      id_conductor,
      id_vehiculo,
      fecha_vencimiento: fechaVencimiento,
      monto_base: montoBase.toFixed(2),
      monto_recargos: montoRecargos.toFixed(2),
      monto_descuentos: montoDescuentos.toFixed(2),
      monto_total: montoTotal.toFixed(2),
      estado: 'APROBADA',
      mensaje_rechazo: null,
      acepta_terminos,
    });

    res.status(201).json({
      mensaje: 'Cotización calculada exitosamente',
      cotizacion,
      detalleCalculo,
      informacion: {
        conductor: {
          nombre: conductor.nombre_completo,
          edad: validacionEdad.edad,
          accidentes: numeroAccidentes,
        },
        vehiculo: {
          marca: vehiculo.marca,
          modelo: vehiculo.modelo,
          tipo: vehiculo.tipo_vehiculo,
          uso: vehiculo.uso_vehiculo,
          antiguedad: validacionVehiculo.antiguedad,
        },
        vigencia: {
          desde: new Date().toISOString().split('T')[0],
          hasta: fechaVencimiento.toISOString().split('T')[0],
          dias: DIAS_VIGENCIA_COTIZACION,
        },
      },
    });
  } catch (error) {
    console.error('Error al calcular cotización:', error);
    res.status(500).json({
      error: 'Error al calcular la cotización',
      detalle: error.message,
    });
  }
};

// Obtener todas las cotizaciones
export const obtenerCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.findAll({
      include: [
        {
          model: Conductor,
          as: 'conductor',
          attributes: [
            'id_conductor',
            'nombre_completo',
            'identificacion',
            'numero_accidentes',
          ],
        },
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: [
            'id_vehiculo',
            'marca',
            'modelo',
            'placa',
            'tipo_vehiculo',
            'uso_vehiculo',
          ],
        },
      ],
      order: [['fecha_creacion', 'DESC']],
    });

    res.status(200).json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({
      error: 'Error al obtener las cotizaciones',
      detalle: error.message,
    });
  }
};

// Obtener cotización por ID
export const obtenerCotizacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await Cotizacion.findByPk(id, {
      include: [
        {
          model: Conductor,
          as: 'conductor',
        },
        {
          model: Vehiculo,
          as: 'vehiculo',
        },
      ],
    });

    if (!cotizacion) {
      return res.status(404).json({
        error: 'Cotización no encontrada',
      });
    }

    // Verificar si está vencida
    const ahora = new Date();
    const estaVencida = new Date(cotizacion.fecha_vencimiento) < ahora;

    if (estaVencida && cotizacion.estado !== 'VENCIDA') {
      await cotizacion.update({ estado: 'VENCIDA' });
    }

    res.status(200).json({
      ...cotizacion.toJSON(),
      esta_vencida: estaVencida,
    });
  } catch (error) {
    console.error('Error al obtener cotización:', error);
    res.status(500).json({
      error: 'Error al obtener la cotización',
      detalle: error.message,
    });
  }
};

// Actualizar estado de cotización
export const actualizarEstadoCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cotizacion = await Cotizacion.findByPk(id);

    if (!cotizacion) {
      return res.status(404).json({
        error: 'Cotización no encontrada',
      });
    }

    // Verificar si está vencida
    const ahora = new Date();
    const estaVencida = new Date(cotizacion.fecha_vencimiento) < ahora;

    if (estaVencida) {
      return res.status(400).json({
        error: 'Una cotización vencida no puede convertirse en póliza',
        fecha_vencimiento: cotizacion.fecha_vencimiento,
      });
    }

    await cotizacion.update({ estado });

    res.status(200).json({
      mensaje: 'Estado de cotización actualizado',
      cotizacion,
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      error: 'Error al actualizar el estado de la cotización',
      detalle: error.message,
    });
  }
};

// Eliminar cotización
export const eliminarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await Cotizacion.findByPk(id);

    if (!cotizacion) {
      return res.status(404).json({
        error: 'Cotización no encontrada',
      });
    }

    await cotizacion.destroy();

    res.status(200).json({
      mensaje: 'Cotización eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({
      error: 'Error al eliminar la cotización',
      detalle: error.message,
    });
  }
};

// Obtener cotizaciones por conductor
export const obtenerCotizacionesPorConductor = async (req, res) => {
  try {
    const { id_conductor } = req.params;

    const cotizaciones = await Cotizacion.findAll({
      where: { id_conductor },
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
        },
      ],
      order: [['fecha_creacion', 'DESC']],
    });

    res.status(200).json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({
      error: 'Error al obtener las cotizaciones del conductor',
      detalle: error.message,
    });
  }
};
