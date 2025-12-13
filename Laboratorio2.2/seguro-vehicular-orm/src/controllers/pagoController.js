import { Pago } from '../models/pago.js';
import { Cotizacion } from '../models/cotizacion.js';
import { Conductor } from '../models/conductor.js';
import { Vehiculo } from '../models/vehiculo.js';

// Constantes para cálculo de pagos
const PORCENTAJES_PAGO = {
  DESCUENTO_PAGO_ANUAL_CREDITO: 0.05, // 5% descuento pago anual con crédito
  INCREMENTO_CUOTAS_BASE: 0.03, // 3% por cada cuota adicional
};

// Procesar pago de una cotización
export const procesarPago = async (req, res) => {
  try {
    const {
      id_cotizacion,
      tipo_tarjeta,
      modalidad_pago,
      numero_cuotas,
      codigo_referencia_pasarela,
    } = req.body;

    // Buscar la cotización
    const cotizacion = await Cotizacion.findByPk(id_cotizacion, {
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

    // Verificar que la cotización esté aprobada
    if (cotizacion.estado !== 'APROBADA') {
      return res.status(400).json({
        error: 'Solo se pueden pagar cotizaciones aprobadas',
        estado_actual: cotizacion.estado,
      });
    }

    // Verificar vigencia de la cotización
    const ahora = new Date();
    const estaVencida = new Date(cotizacion.fecha_vencimiento) < ahora;

    if (estaVencida) {
      // Actualizar estado a vencida
      await cotizacion.update({ estado: 'VENCIDA' });

      return res.status(400).json({
        error: 'La cotización ha vencido y no puede convertirse en póliza',
        fecha_vencimiento: cotizacion.fecha_vencimiento,
      });
    }

    // --- CÁLCULO DEL MONTO A PAGAR ---

    let montoPagar = parseFloat(cotizacion.monto_total);
    const detallesPago = [];

    // 1. Validar y aplicar reglas de pago según tarjeta
    if (tipo_tarjeta === 'CREDITO' && modalidad_pago === 'CONTADO') {
      // Descuento por pago anual con crédito
      const descuento =
        montoPagar * PORCENTAJES_PAGO.DESCUENTO_PAGO_ANUAL_CREDITO;
      montoPagar -= descuento;
      detallesPago.push({
        concepto: 'Descuento por pago anual con tarjeta de crédito',
        monto: -descuento.toFixed(2),
      });
    }

    // 2. Aplicar incremento por cuotas
    const cuotas = numero_cuotas || 1;

    if (cuotas > 1) {
      if (modalidad_pago !== 'DIFERIDO') {
        return res.status(400).json({
          error: 'El pago en cuotas requiere modalidad DIFERIDO',
        });
      }

      // Incremento por número de cuotas
      const incrementoCuotas =
        montoPagar * PORCENTAJES_PAGO.INCREMENTO_CUOTAS_BASE * (cuotas - 1);
      montoPagar += incrementoCuotas;
      detallesPago.push({
        concepto: `Incremento por pago en ${cuotas} cuotas`,
        monto: incrementoCuotas.toFixed(2),
      });
    }

    // 3. Simular procesamiento de pago (en producción, aquí se integraría con pasarela real)
    // Por ahora, simulamos que el 90% de los pagos son exitosos
    const estadoTransaccion = Math.random() > 0.1 ? 'EXITOSO' : 'FALLIDO';

    // Crear registro de pago
    const pago = await Pago.create({
      id_cotizacion,
      tipo_tarjeta,
      modalidad_pago,
      numero_cuotas: cuotas,
      monto_pagado: montoPagar.toFixed(2),
      estado_transaccion: estadoTransaccion,
      codigo_referencia_pasarela:
        codigo_referencia_pasarela || `REF-${Date.now()}`,
    });

    // 4. Actualizar estado de cotización según resultado
    if (estadoTransaccion === 'EXITOSO') {
      // Pago exitoso - La cotización puede convertirse en póliza
      // (En un sistema real, aquí se generaría la póliza)
      await cotizacion.update({ estado: 'APROBADA' });

      res.status(201).json({
        mensaje: 'Pago procesado exitosamente',
        pago,
        detallesPago,
        poliza: {
          estado: 'EMITIDA',
          mensaje:
            tipo_tarjeta === 'CREDITO'
              ? 'Póliza emitida inmediatamente'
              : tipo_tarjeta === 'DEBITO'
              ? 'Activación inmediata - Pago aprobado'
              : 'Póliza en proceso',
        },
        cotizacion: {
          id: cotizacion.id_cotizacion,
          monto_original: cotizacion.monto_total,
          monto_final: montoPagar.toFixed(2),
        },
      });
    } else {
      // Pago fallido - Cotización queda pendiente
      await cotizacion.update({ estado: 'PENDIENTE' });

      res.status(400).json({
        mensaje: 'El pago ha fallado',
        pago,
        cotizacion: {
          id: cotizacion.id_cotizacion,
          estado: 'PENDIENTE',
          mensaje:
            'La cotización queda en estado pendiente. Puede intentar el pago nuevamente.',
        },
      });
    }
  } catch (error) {
    console.error('Error al procesar pago:', error);
    res.status(500).json({
      error: 'Error al procesar el pago',
      detalle: error.message,
    });
  }
};

// Obtener todos los pagos
export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        {
          model: Cotizacion,
          as: 'cotizacion',
          include: [
            {
              model: Conductor,
              as: 'conductor',
              attributes: ['nombre_completo', 'identificacion'],
            },
            {
              model: Vehiculo,
              as: 'vehiculo',
              attributes: ['marca', 'modelo', 'placa'],
            },
          ],
        },
      ],
      order: [['fecha_pago', 'DESC']],
    });

    res.status(200).json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      error: 'Error al obtener los pagos',
      detalle: error.message,
    });
  }
};

// Obtener pago por ID
export const obtenerPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id, {
      include: [
        {
          model: Cotizacion,
          as: 'cotizacion',
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
        },
      ],
    });

    if (!pago) {
      return res.status(404).json({
        error: 'Pago no encontrado',
      });
    }

    res.status(200).json(pago);
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({
      error: 'Error al obtener el pago',
      detalle: error.message,
    });
  }
};

// Obtener pagos por cotización
export const obtenerPagosPorCotizacion = async (req, res) => {
  try {
    const { id_cotizacion } = req.params;

    const pagos = await Pago.findAll({
      where: { id_cotizacion },
      order: [['fecha_pago', 'DESC']],
    });

    res.status(200).json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      error: 'Error al obtener los pagos de la cotización',
      detalle: error.message,
    });
  }
};

// Reintentar pago fallido
export const reintentarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;

    const pagoAnterior = await Pago.findByPk(id_pago, {
      include: [
        {
          model: Cotizacion,
          as: 'cotizacion',
        },
      ],
    });

    if (!pagoAnterior) {
      return res.status(404).json({
        error: 'Pago no encontrado',
      });
    }

    if (pagoAnterior.estado_transaccion !== 'FALLIDO') {
      return res.status(400).json({
        error: 'Solo se pueden reintentar pagos fallidos',
        estado_actual: pagoAnterior.estado_transaccion,
      });
    }

    // Verificar vigencia de cotización
    const cotizacion = pagoAnterior.cotizacion;
    const estaVencida = new Date(cotizacion.fecha_vencimiento) < new Date();

    if (estaVencida) {
      return res.status(400).json({
        error: 'La cotización ha vencido. No se puede reintentar el pago.',
        fecha_vencimiento: cotizacion.fecha_vencimiento,
      });
    }

    // Simular reintento (90% de éxito)
    const estadoTransaccion = Math.random() > 0.1 ? 'EXITOSO' : 'FALLIDO';

    // Actualizar el pago existente en lugar de crear uno nuevo
    await pagoAnterior.update({
      estado_transaccion: estadoTransaccion,
      codigo_referencia_pasarela: `RETRY-${Date.now()}`,
      fecha_pago: new Date(),
    });

    if (estadoTransaccion === 'EXITOSO') {
      await cotizacion.update({ estado: 'APROBADA' });

      res.status(200).json({
        mensaje: 'Pago reintentado exitosamente',
        pago: pagoAnterior,
        poliza: {
          estado: 'EMITIDA',
          mensaje: 'Póliza emitida tras reintento exitoso',
        },
      });
    } else {
      await cotizacion.update({ estado: 'PENDIENTE' });

      res.status(400).json({
        mensaje: 'El reintento de pago ha fallado',
        pago: pagoAnterior,
      });
    }
  } catch (error) {
    console.error('Error al reintentar pago:', error);
    res.status(500).json({
      error: 'Error al reintentar el pago',
      detalle: error.message,
    });
  }
};

// Eliminar pago
export const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id);

    if (!pago) {
      return res.status(404).json({
        error: 'Pago no encontrado',
      });
    }

    await pago.destroy();

    res.status(200).json({
      mensaje: 'Pago eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    res.status(500).json({
      error: 'Error al eliminar el pago',
      detalle: error.message,
    });
  }
};
