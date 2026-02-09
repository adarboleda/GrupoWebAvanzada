import { Cliente, Cuenta, Transaccion, Tarjeta, VinculacionDeuna } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * CONSULTAS AVANZADAS PARA EL SISTEMA DEUNA
 * Este archivo contiene ejemplos de consultas avanzadas con filtros, joins y búsquedas
 */

class ConsultasAvanzadas {
  
  // ============================================================
  // CONSULTAS CON FILTROS
  // ============================================================

  /**
   * Buscar clientes por diferentes criterios
   */
  async buscarClientesConFiltros(filtros) {
    const where = {};

    if (filtros.nombre) {
      where.nombre = { [Op.like]: `%${filtros.nombre}%` };
    }

    if (filtros.cedula) {
      where.cedula = filtros.cedula;
    }

    if (filtros.email) {
      where.email = { [Op.like]: `%${filtros.email}%` };
    }

    if (filtros.codigoDeuna) {
      where.codigoDeuna = filtros.codigoDeuna;
    }

    if (filtros.activo !== undefined) {
      where.activo = filtros.activo;
    }

    return await Cliente.findAll({
      where,
      include: [{
        model: Cuenta,
        as: 'cuentas',
        where: { activo: true },
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Buscar transacciones con filtros avanzados
   */
  async buscarTransaccionesConFiltros(filtros) {
    const where = {};

    // Filtro por tipo de transacción
    if (filtros.tipo) {
      where.tipoTransaccion = filtros.tipo;
    }

    // Filtro por estado
    if (filtros.estado) {
      where.estado = filtros.estado;
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      where.createdAt = {
        [Op.between]: [filtros.fechaInicio, filtros.fechaFin]
      };
    }

    // Filtro por rango de montos
    if (filtros.montoMin || filtros.montoMax) {
      where.monto = {};
      if (filtros.montoMin) {
        where.monto[Op.gte] = filtros.montoMin;
      }
      if (filtros.montoMax) {
        where.monto[Op.lte] = filtros.montoMax;
      }
    }

    // Filtro por cliente (origen o destino)
    if (filtros.clienteId) {
      where[Op.or] = [
        { origenId: filtros.clienteId },
        { destinoId: filtros.clienteId }
      ];
    }

    return await Transaccion.findAll({
      where,
      include: [
        {
          model: Cliente,
          as: 'clienteOrigen',
          attributes: ['id', 'nombre', 'codigoDeuna']
        },
        {
          model: Cliente,
          as: 'clienteDestino',
          attributes: ['id', 'nombre', 'codigoDeuna']
        },
        {
          model: Cuenta,
          as: 'cuentaOrigen',
          attributes: ['id', 'numeroCuenta', 'tipoCuenta']
        },
        {
          model: Cuenta,
          as: 'cuentaDestino',
          attributes: ['id', 'numeroCuenta', 'tipoCuenta']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: filtros.limite || 50
    });
  }

  /**
   * Buscar cuentas con filtros
   */
  async buscarCuentasConFiltros(filtros) {
    const where = {};

    if (filtros.tipoCuenta) {
      where.tipoCuenta = filtros.tipoCuenta;
    }

    if (filtros.saldoMin || filtros.saldoMax) {
      where.saldo = {};
      if (filtros.saldoMin) {
        where.saldo[Op.gte] = filtros.saldoMin;
      }
      if (filtros.saldoMax) {
        where.saldo[Op.lte] = filtros.saldoMax;
      }
    }

    if (filtros.activo !== undefined) {
      where.activo = filtros.activo;
    }

    return await Cuenta.findAll({
      where,
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nombre', 'cedula', 'codigoDeuna']
      }],
      order: [['saldo', 'DESC']]
    });
  }

  // ============================================================
  // CONSULTAS CON JOINS COMPLEJOS
  // ============================================================

  /**
   * Obtener cliente completo con todas sus relaciones
   */
  async obtenerClienteCompleto(clienteId) {
    return await Cliente.findByPk(clienteId, {
      include: [
        {
          model: Cuenta,
          as: 'cuentas',
          include: [
            {
              model: Tarjeta,
              as: 'tarjetas',
              where: { activo: true },
              required: false
            },
            {
              model: VinculacionDeuna,
              as: 'vinculacionesDeuna',
              where: { activo: true },
              required: false
            }
          ]
        },
        {
          model: Transaccion,
          as: 'transaccionesEnviadas',
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [{
            model: Cliente,
            as: 'clienteDestino',
            attributes: ['nombre', 'codigoDeuna']
          }]
        },
        {
          model: Transaccion,
          as: 'transaccionesRecibidas',
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [{
            model: Cliente,
            as: 'clienteOrigen',
            attributes: ['nombre', 'codigoDeuna']
          }]
        }
      ]
    });
  }

  /**
   * Obtener transacciones entre dos clientes específicos
   */
  async obtenerTransaccionesEntreClientes(clienteId1, clienteId2) {
    return await Transaccion.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { origenId: clienteId1 },
              { destinoId: clienteId2 }
            ]
          },
          {
            [Op.and]: [
              { origenId: clienteId2 },
              { destinoId: clienteId1 }
            ]
          }
        ]
      },
      include: [
        {
          model: Cliente,
          as: 'clienteOrigen',
          attributes: ['id', 'nombre']
        },
        {
          model: Cliente,
          as: 'clienteDestino',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Obtener todas las cuentas con sus vinculaciones Deuna
   */
  async obtenerCuentasConVinculaciones() {
    return await Cuenta.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'codigoDeuna']
        },
        {
          model: VinculacionDeuna,
          as: 'vinculacionesDeuna',
          where: { activo: true },
          required: false
        }
      ],
      where: { activo: true }
    });
  }

  // ============================================================
  // BÚSQUEDAS AVANZADAS
  // ============================================================

  /**
   * Búsqueda global (busca en múltiples campos)
   */
  async busquedaGlobal(termino) {
    return await Cliente.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${termino}%` } },
          { cedula: { [Op.like]: `%${termino}%` } },
          { email: { [Op.like]: `%${termino}%` } },
          { usuario: { [Op.like]: `%${termino}%` } },
          { codigoDeuna: { [Op.like]: `%${termino}%` } }
        ]
      },
      include: [{
        model: Cuenta,
        as: 'cuentas',
        where: { activo: true },
        required: false
      }]
    });
  }

  /**
   * Buscar transacciones por referencia o descripción
   */
  async buscarTransaccionesPorTexto(texto) {
    return await Transaccion.findAll({
      where: {
        [Op.or]: [
          { referencia: { [Op.like]: `%${texto}%` } },
          { descripcion: { [Op.like]: `%${texto}%` } }
        ]
      },
      include: [
        {
          model: Cliente,
          as: 'clienteOrigen',
          attributes: ['nombre']
        },
        {
          model: Cliente,
          as: 'clienteDestino',
          attributes: ['nombre']
        }
      ]
    });
  }

  // ============================================================
  // REPORTES Y ESTADÍSTICAS
  // ============================================================

  /**
   * Reporte de transacciones por cliente (últimos 30 días)
   */
  async reporteTransaccionesCliente(clienteId) {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const transacciones = await Transaccion.findAll({
      where: {
        [Op.or]: [
          { origenId: clienteId },
          { destinoId: clienteId }
        ],
        createdAt: { [Op.gte]: hace30Dias }
      },
      include: [
        {
          model: Cliente,
          as: 'clienteOrigen',
          attributes: ['nombre']
        },
        {
          model: Cliente,
          as: 'clienteDestino',
          attributes: ['nombre']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calcular totales
    let totalEnviado = 0;
    let totalRecibido = 0;
    let totalComisiones = 0;

    transacciones.forEach(tx => {
      if (tx.origenId === clienteId) {
        totalEnviado += parseFloat(tx.montoTotal);
        totalComisiones += parseFloat(tx.comision);
      }
      if (tx.destinoId === clienteId) {
        totalRecibido += parseFloat(tx.monto);
      }
    });

    return {
      transacciones,
      resumen: {
        totalTransacciones: transacciones.length,
        totalEnviado: totalEnviado.toFixed(2),
        totalRecibido: totalRecibido.toFixed(2),
        totalComisiones: totalComisiones.toFixed(2),
        saldoNeto: (totalRecibido - totalEnviado).toFixed(2)
      }
    };
  }

  /**
   * Top 10 clientes con más transacciones
   */
  async topClientesActivos() {
    const resultado = await sequelize.query(`
      SELECT 
        c.id,
        c.nombre,
        c.codigoDeuna,
        COUNT(DISTINCT t.id) as total_transacciones,
        SUM(CASE WHEN t.origenId = c.id THEN t.monto ELSE 0 END) as total_enviado,
        SUM(CASE WHEN t.destinoId = c.id THEN t.monto ELSE 0 END) as total_recibido
      FROM clientes c
      LEFT JOIN transacciones t ON (t.origenId = c.id OR t.destinoId = c.id)
      WHERE c.activo = TRUE
      GROUP BY c.id, c.nombre, c.codigoDeuna
      ORDER BY total_transacciones DESC
      LIMIT 10
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return resultado;
  }

  /**
   * Estadísticas de transacciones por período
   */
  async estadisticasPorPeriodo(fechaInicio, fechaFin) {
    const resultado = await sequelize.query(`
      SELECT 
        tipoTransaccion,
        estado,
        COUNT(*) as cantidad,
        SUM(monto) as monto_total,
        SUM(comision) as comision_total,
        AVG(monto) as monto_promedio
      FROM transacciones
      WHERE createdAt BETWEEN :fechaInicio AND :fechaFin
      GROUP BY tipoTransaccion, estado
      ORDER BY tipoTransaccion, estado
    `, {
      replacements: { fechaInicio, fechaFin },
      type: sequelize.QueryTypes.SELECT
    });

    return resultado;
  }

  /**
   * Cuentas con mayor movimiento
   */
  async cuentasMayorMovimiento(limite = 10) {
    const resultado = await sequelize.query(`
      SELECT 
        cta.id,
        cta.numeroCuenta,
        cta.tipoCuenta,
        cta.saldo,
        c.nombre as cliente_nombre,
        COUNT(DISTINCT t.id) as total_transacciones,
        SUM(CASE WHEN t.cuentaOrigenId = cta.id THEN t.monto ELSE 0 END) as total_salidas,
        SUM(CASE WHEN t.cuentaDestinoId = cta.id THEN t.monto ELSE 0 END) as total_entradas
      FROM cuentas cta
      INNER JOIN clientes c ON cta.clienteId = c.id
      LEFT JOIN transacciones t ON (t.cuentaOrigenId = cta.id OR t.cuentaDestinoId = cta.id)
      WHERE cta.activo = TRUE
      GROUP BY cta.id, cta.numeroCuenta, cta.tipoCuenta, cta.saldo, c.nombre
      ORDER BY total_transacciones DESC
      LIMIT :limite
    `, {
      replacements: { limite },
      type: sequelize.QueryTypes.SELECT
    });

    return resultado;
  }

  /**
   * Reporte de comisiones generadas
   */
  async reporteComisiones(fechaInicio, fechaFin) {
    const resultado = await sequelize.query(`
      SELECT 
        DATE(createdAt) as fecha,
        tipoTransaccion,
        COUNT(*) as cantidad_transacciones,
        SUM(comision) as total_comisiones,
        AVG(comision) as comision_promedio
      FROM transacciones
      WHERE createdAt BETWEEN :fechaInicio AND :fechaFin
        AND estado = 'CONFIRMADA'
      GROUP BY DATE(createdAt), tipoTransaccion
      ORDER BY fecha DESC, tipoTransaccion
    `, {
      replacements: { fechaInicio, fechaFin },
      type: sequelize.QueryTypes.SELECT
    });

    return resultado;
  }
}

export default new ConsultasAvanzadas();

/**
 * EJEMPLOS DE USO:
 * 
 * // Buscar clientes por nombre
 * const clientes = await consultasAvanzadas.buscarClientesConFiltros({ 
 *   nombre: 'Juan',
 *   activo: true 
 * });
 * 
 * // Buscar transacciones del último mes con monto > $100
 * const transacciones = await consultasAvanzadas.buscarTransaccionesConFiltros({
 *   fechaInicio: new Date('2026-01-01'),
 *   fechaFin: new Date('2026-02-01'),
 *   montoMin: 100,
 *   estado: 'CONFIRMADA'
 * });
 * 
 * // Obtener cliente con todas sus relaciones
 * const clienteCompleto = await consultasAvanzadas.obtenerClienteCompleto(1);
 * 
 * // Búsqueda global
 * const resultados = await consultasAvanzadas.busquedaGlobal('Juan');
 * 
 * // Reporte de transacciones
 * const reporte = await consultasAvanzadas.reporteTransaccionesCliente(1);
 * 
 * // Top clientes activos
 * const topClientes = await consultasAvanzadas.topClientesActivos();
 * 
 * // Estadísticas por período
 * const stats = await consultasAvanzadas.estadisticasPorPeriodo(
 *   new Date('2026-01-01'),
 *   new Date('2026-02-01')
 * );
 */
