import express from 'express';
import consultasAvanzadas from '../services/consultas.avanzadas.js';

const router = express.Router();

/**
 * RUTAS PARA CONSULTAS Y REPORTES AVANZADOS
 */

// ============================================================
// BÚSQUEDAS CON FILTROS
// ============================================================

/**
 * @route   GET /api/reportes/clientes/buscar
 * @desc    Buscar clientes con filtros
 * @query   nombre, cedula, email, codigoDeuna, activo
 */
router.get('/clientes/buscar', async (req, res) => {
  try {
    const filtros = {
      nombre: req.query.nombre,
      cedula: req.query.cedula,
      email: req.query.email,
      codigoDeuna: req.query.codigoDeuna,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined
    };

    const clientes = await consultasAvanzadas.buscarClientesConFiltros(filtros);

    res.json({
      ok: true,
      data: clientes,
      total: clientes.length
    });
  } catch (error) {
    console.error('Error búsqueda clientes:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar clientes'
    });
  }
});

/**
 * @route   GET /api/reportes/transacciones/buscar
 * @desc    Buscar transacciones con filtros
 * @query   tipo, estado, fechaInicio, fechaFin, montoMin, montoMax, clienteId, limite
 */
router.get('/transacciones/buscar', async (req, res) => {
  try {
    const filtros = {
      tipo: req.query.tipo,
      estado: req.query.estado,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      montoMin: req.query.montoMin ? parseFloat(req.query.montoMin) : undefined,
      montoMax: req.query.montoMax ? parseFloat(req.query.montoMax) : undefined,
      clienteId: req.query.clienteId ? parseInt(req.query.clienteId) : undefined,
      limite: req.query.limite ? parseInt(req.query.limite) : 50
    };

    const transacciones = await consultasAvanzadas.buscarTransaccionesConFiltros(filtros);

    res.json({
      ok: true,
      data: transacciones,
      total: transacciones.length
    });
  } catch (error) {
    console.error('Error búsqueda transacciones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar transacciones'
    });
  }
});

/**
 * @route   GET /api/reportes/cuentas/buscar
 * @desc    Buscar cuentas con filtros
 * @query   tipoCuenta, saldoMin, saldoMax, activo
 */
router.get('/cuentas/buscar', async (req, res) => {
  try {
    const filtros = {
      tipoCuenta: req.query.tipoCuenta,
      saldoMin: req.query.saldoMin ? parseFloat(req.query.saldoMin) : undefined,
      saldoMax: req.query.saldoMax ? parseFloat(req.query.saldoMax) : undefined,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined
    };

    const cuentas = await consultasAvanzadas.buscarCuentasConFiltros(filtros);

    res.json({
      ok: true,
      data: cuentas,
      total: cuentas.length
    });
  } catch (error) {
    console.error('Error búsqueda cuentas:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar cuentas'
    });
  }
});

// ============================================================
// CONSULTAS COMPLEJAS CON JOINS
// ============================================================

/**
 * @route   GET /api/reportes/clientes/:id/completo
 * @desc    Obtener cliente con todas sus relaciones
 */
router.get('/clientes/:id/completo', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await consultasAvanzadas.obtenerClienteCompleto(parseInt(id));

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        msg: 'Cliente no encontrado'
      });
    }

    res.json({
      ok: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error obtener cliente completo:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener información del cliente'
    });
  }
});

/**
 * @route   GET /api/reportes/transacciones/entre/:id1/:id2
 * @desc    Obtener transacciones entre dos clientes
 */
router.get('/transacciones/entre/:id1/:id2', async (req, res) => {
  try {
    const { id1, id2 } = req.params;
    const transacciones = await consultasAvanzadas.obtenerTransaccionesEntreClientes(
      parseInt(id1),
      parseInt(id2)
    );

    res.json({
      ok: true,
      data: transacciones,
      total: transacciones.length
    });
  } catch (error) {
    console.error('Error obtener transacciones entre clientes:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener transacciones'
    });
  }
});

/**
 * @route   GET /api/reportes/cuentas/vinculaciones
 * @desc    Obtener todas las cuentas con sus vinculaciones Deuna
 */
router.get('/cuentas/vinculaciones', async (req, res) => {
  try {
    const cuentas = await consultasAvanzadas.obtenerCuentasConVinculaciones();

    res.json({
      ok: true,
      data: cuentas,
      total: cuentas.length
    });
  } catch (error) {
    console.error('Error obtener cuentas con vinculaciones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener cuentas'
    });
  }
});

// ============================================================
// BÚSQUEDAS AVANZADAS
// ============================================================

/**
 * @route   GET /api/reportes/buscar/:termino
 * @desc    Búsqueda global en clientes
 */
router.get('/buscar/:termino', async (req, res) => {
  try {
    const { termino } = req.params;
    const resultados = await consultasAvanzadas.busquedaGlobal(termino);

    res.json({
      ok: true,
      data: resultados,
      total: resultados.length
    });
  } catch (error) {
    console.error('Error búsqueda global:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error en la búsqueda'
    });
  }
});

/**
 * @route   GET /api/reportes/transacciones/buscar-texto/:texto
 * @desc    Buscar transacciones por referencia o descripción
 */
router.get('/transacciones/buscar-texto/:texto', async (req, res) => {
  try {
    const { texto } = req.params;
    const transacciones = await consultasAvanzadas.buscarTransaccionesPorTexto(texto);

    res.json({
      ok: true,
      data: transacciones,
      total: transacciones.length
    });
  } catch (error) {
    console.error('Error búsqueda texto transacciones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar transacciones'
    });
  }
});

// ============================================================
// REPORTES Y ESTADÍSTICAS
// ============================================================

/**
 * @route   GET /api/reportes/clientes/:id/transacciones
 * @desc    Reporte de transacciones del cliente (últimos 30 días)
 */
router.get('/clientes/:id/transacciones', async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await consultasAvanzadas.reporteTransaccionesCliente(parseInt(id));

    res.json({
      ok: true,
      data: reporte
    });
  } catch (error) {
    console.error('Error reporte transacciones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al generar reporte'
    });
  }
});

/**
 * @route   GET /api/reportes/top-clientes
 * @desc    Top 10 clientes con más transacciones
 */
router.get('/top-clientes', async (req, res) => {
  try {
    const topClientes = await consultasAvanzadas.topClientesActivos();

    res.json({
      ok: true,
      data: topClientes
    });
  } catch (error) {
    console.error('Error top clientes:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener top clientes'
    });
  }
});

/**
 * @route   GET /api/reportes/estadisticas/periodo
 * @desc    Estadísticas de transacciones por período
 * @query   fechaInicio, fechaFin
 */
router.get('/estadisticas/periodo', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        ok: false,
        msg: 'Se requieren fechaInicio y fechaFin'
      });
    }

    const stats = await consultasAvanzadas.estadisticasPorPeriodo(
      new Date(fechaInicio),
      new Date(fechaFin)
    );

    res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    console.error('Error estadísticas período:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener estadísticas'
    });
  }
});

/**
 * @route   GET /api/reportes/cuentas/mayor-movimiento
 * @desc    Cuentas con mayor movimiento
 * @query   limite (default: 10)
 */
router.get('/cuentas/mayor-movimiento', async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const cuentas = await consultasAvanzadas.cuentasMayorMovimiento(limite);

    res.json({
      ok: true,
      data: cuentas
    });
  } catch (error) {
    console.error('Error cuentas mayor movimiento:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener cuentas'
    });
  }
});

/**
 * @route   GET /api/reportes/comisiones
 * @desc    Reporte de comisiones generadas
 * @query   fechaInicio, fechaFin
 */
router.get('/comisiones', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        ok: false,
        msg: 'Se requieren fechaInicio y fechaFin'
      });
    }

    const reporte = await consultasAvanzadas.reporteComisiones(
      new Date(fechaInicio),
      new Date(fechaFin)
    );

    // Calcular total
    const totalComisiones = reporte.reduce((sum, item) => 
      sum + parseFloat(item.total_comisiones || 0), 0
    );

    res.json({
      ok: true,
      data: {
        detalle: reporte,
        totalComisiones: totalComisiones.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error reporte comisiones:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al generar reporte de comisiones'
    });
  }
});

export default router;
