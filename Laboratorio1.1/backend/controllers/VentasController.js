/**
 * CONTROLADOR - Controlador de Ventas
 * Gestiona el flujo de datos entre el Modelo y la Vista (API REST)
 */

const VentasModel = require("../models/VentasModel");

class VentasController {
  /**
   * Crea una nueva venta
   * POST /api/ventas
   */
  static async crearVenta(req, res) {
    try {
      // Aceptar tanto `monto` como `monto_vendido` desde el cliente
      const { monto, monto_vendido } = req.body;

      // Determinar el valor recibido (prioriza `monto` si existe)
      const rawMonto = monto !== undefined ? monto : monto_vendido;

      // Parsear y validar
      const parsedMonto = parseFloat(rawMonto);
      if (
        rawMonto === undefined ||
        rawMonto === null ||
        Number.isNaN(parsedMonto) ||
        parsedMonto <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "El monto debe ser un número positivo válido",
        });
      }

      // Llamar al modelo para crear la venta
      const resultado = await VentasModel.crearVenta(parsedMonto);

      // Retornar respuesta exitosa
      res.status(201).json({
        success: true,
        message: "Venta registrada exitosamente",
        data: resultado,
      });
    } catch (error) {
      console.error("Error en crearVenta:", error);
      res.status(500).json({
        success: false,
        message: "Error al registrar la venta",
        error: error.message,
      });
    }
  }

  /**
   * Obtiene todas las ventas
   * GET /api/ventas
   */
  static async obtenerVentas(req, res) {
    try {
      const ventas = await VentasModel.obtenerTodasVentas();

      res.status(200).json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      console.error("Error en obtenerVentas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las ventas",
        error: error.message,
      });
    }
  }

  /**
   * Obtiene las estadísticas de ventas
   * GET /api/ventas/estadisticas
   */
  static async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await VentasModel.obtenerEstadisticas();

      res.status(200).json({
        success: true,
        data: estadisticas,
      });
    } catch (error) {
      console.error("Error en obtenerEstadisticas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas",
        error: error.message,
      });
    }
  }

  /**
   * Elimina todas las ventas
   * DELETE /api/ventas
   */
  static async eliminarVentas(req, res) {
    try {
      await VentasModel.eliminarTodasVentas();

      res.status(200).json({
        success: true,
        message: "Todas las ventas han sido eliminadas",
      });
    } catch (error) {
      console.error("Error en eliminarVentas:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar las ventas",
        error: error.message,
      });
    }
  }

  /**
   * Obtiene ventas por tipo
   * GET /api/ventas/tipo/:tipo
   */
  static async obtenerVentasPorTipo(req, res) {
    try {
      const { tipo } = req.params;

      // Validar tipo
      if (!["A", "B", "C"].includes(tipo.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Tipo de venta inválido. Use A, B o C",
        });
      }

      const ventas = await VentasModel.obtenerVentasPorTipo(tipo.toUpperCase());

      res.status(200).json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      console.error("Error en obtenerVentasPorTipo:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener ventas por tipo",
        error: error.message,
      });
    }
  }

  /**
   * Obtiene una venta por ID
   * GET /api/ventas/:id
   */
  static async obtenerVentaPorId(req, res) {
    try {
      const { id } = req.params;

      const venta = await VentasModel.obtenerVentaPorId(id);

      if (!venta) {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        data: venta,
      });
    } catch (error) {
      console.error("Error en obtenerVentaPorId:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener la venta",
        error: error.message,
      });
    }
  }

  /**
   * Actualiza una venta existente
   * PUT /api/ventas/:id
   */
  static async actualizarVenta(req, res) {
    try {
      const { id } = req.params;
      const { monto, monto_vendido } = req.body;

      const rawMonto = monto !== undefined ? monto : monto_vendido;
      const parsedMonto = parseFloat(rawMonto);
      // Validación de entrada
      if (
        rawMonto === undefined ||
        rawMonto === null ||
        Number.isNaN(parsedMonto) ||
        parsedMonto <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "El monto debe ser un número positivo válido",
        });
      }

      // Llamar al modelo para actualizar la venta
      const resultado = await VentasModel.actualizarVenta(id, parsedMonto);

      // Retornar respuesta exitosa
      res.status(200).json({
        success: true,
        message: "Venta actualizada exitosamente",
        data: resultado,
      });
    } catch (error) {
      console.error("Error en actualizarVenta:", error);

      if (error.message === "Venta no encontrada") {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error al actualizar la venta",
        error: error.message,
      });
    }
  }

  /**
   * Elimina una venta por ID
   * DELETE /api/ventas/:id
   */
  static async eliminarVenta(req, res) {
    try {
      const { id } = req.params;

      await VentasModel.eliminarVenta(id);

      res.status(200).json({
        success: true,
        message: "Venta eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error en eliminarVenta:", error);

      if (error.message === "Venta no encontrada") {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error al eliminar la venta",
        error: error.message,
      });
    }
  }
}

module.exports = VentasController;
