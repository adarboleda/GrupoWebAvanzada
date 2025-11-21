import clienteService from '../services/cliente.service.js';

class ClienteController {
  // Crear un nuevo cliente con cálculos
  static async crear(req, res) {
    try {
      const { nombre, saldoAnterior, montoCompras, pagoRealizado } = req.body;

      if (!nombre) {
        return res.status(400).json({
          ok: false,
          msg: 'El nombre del cliente es requerido',
        });
      }

      const cliente = await clienteService.crearCliente({
        nombre,
        saldoAnterior: Number(saldoAnterior) || 0,
        montoCompras: Number(montoCompras) || 0,
        pagoRealizado: Number(pagoRealizado) || 0,
      });

      res.status(201).json({
        ok: true,
        data: cliente,
      });
    } catch (err) {
      console.error('Error crear cliente:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al crear cliente',
      });
    }
  }

  // Obtener todos los clientes
  static async obtenerTodos(req, res) {
    try {
      const clientes = await clienteService.obtenerClientes();

      res.json({
        ok: true,
        data: clientes,
      });
    } catch (err) {
      console.error('Error obtener clientes:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al obtener clientes',
      });
    }
  }

  // Obtener un cliente por ID
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.obtenerClientePorId(id);

      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado',
        });
      }

      res.json({
        ok: true,
        data: cliente,
      });
    } catch (err) {
      console.error('Error obtener cliente:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al obtener cliente',
      });
    }
  }

  // Actualizar un cliente
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, saldoAnterior, montoCompras, pagoRealizado } = req.body;

      const cliente = await clienteService.actualizarCliente(id, {
        nombre,
        saldoAnterior: Number(saldoAnterior),
        montoCompras: Number(montoCompras),
        pagoRealizado: Number(pagoRealizado),
      });

      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado',
        });
      }

      res.json({
        ok: true,
        data: cliente,
      });
    } catch (err) {
      console.error('Error actualizar cliente:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al actualizar cliente',
      });
    }
  }

  // Eliminar un cliente
  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.eliminarCliente(id);

      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado',
        });
      }

      res.json({
        ok: true,
        msg: 'Cliente eliminado exitosamente',
      });
    } catch (err) {
      console.error('Error eliminar cliente:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al eliminar cliente',
      });
    }
  }

  // Obtener estadísticas de clientes morosos
  static async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await clienteService.obtenerEstadisticas();

      res.json({
        ok: true,
        data: estadisticas,
      });
    } catch (err) {
      console.error('Error obtener estadísticas:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al obtener estadísticas',
      });
    }
  }

  // Calcular sin guardar (endpoint legacy)
  static calcular(req, res) {
    try {
      const { saldoAnterior, montoCompras, pagoRealizado } = req.body;

      const resultado = clienteService.calcularDatosCliente({
        saldoAnterior: Number(saldoAnterior) || 0,
        montoCompras: Number(montoCompras) || 0,
        pagoRealizado: Number(pagoRealizado) || 0,
      });

      res.json({
        ok: true,
        data: {
          saldoAnterior: Number(saldoAnterior) || 0,
          montoCompras: Number(montoCompras) || 0,
          pagoRealizado: Number(pagoRealizado) || 0,
          ...resultado,
        },
      });
    } catch (err) {
      console.error('Error calcular:', err);
      res.status(500).json({
        ok: false,
        msg: 'Error interno al calcular datos del cliente',
      });
    }
  }
}

export default ClienteController;
