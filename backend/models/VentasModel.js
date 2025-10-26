/**
 * MODELO - Modelo de Ventas
 * Gestiona la lógica de negocio y las operaciones con la base de datos
 */

const db = require('../config/database');

class VentasModel {
  
  /**
   * Crea una nueva venta en la base de datos
   * @param {number} monto - Monto de la venta
   * @returns {Promise} - Resultado de la inserción
   */
  static async crearVenta(monto) {
    try {
      // Clasificar la venta según el monto
      let tipo;
      if (monto > 1000) {
        tipo = 'A'; // Mayor a $1000
      } else if (monto > 500) {
        tipo = 'B'; // Mayor a $500 pero <= $1000
      } else {
        tipo = 'C'; // Menor o igual a $500
      }

      const query = `
        INSERT INTO ventas (monto, tipo, fecha) 
        VALUES (?, ?, NOW())
      `;
      
      const [result] = await db.execute(query, [monto, tipo]);
      
      return {
        id: result.insertId,
        monto,
        tipo,
        success: true
      };
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las ventas
   * @returns {Promise} - Lista de ventas
   */
  static async obtenerTodasVentas() {
    try {
      const query = 'SELECT * FROM ventas ORDER BY fecha DESC';
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  }

  /**
   * Obtiene las estadísticas de ventas
   * @returns {Promise} - Objeto con estadísticas
   */
  static async obtenerEstadisticas() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_ventas,
          SUM(CASE WHEN tipo = 'A' THEN 1 ELSE 0 END) as ventas_tipo_a,
          SUM(CASE WHEN tipo = 'B' THEN 1 ELSE 0 END) as ventas_tipo_b,
          SUM(CASE WHEN tipo = 'C' THEN 1 ELSE 0 END) as ventas_tipo_c,
          COALESCE(SUM(CASE WHEN tipo = 'A' THEN monto ELSE 0 END), 0) as total_tipo_a,
          COALESCE(SUM(CASE WHEN tipo = 'B' THEN monto ELSE 0 END), 0) as total_tipo_b,
          COALESCE(SUM(CASE WHEN tipo = 'C' THEN monto ELSE 0 END), 0) as total_tipo_c,
          COALESCE(SUM(monto), 0) as total_general
        FROM ventas
      `;
      
      const [rows] = await db.execute(query);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Elimina todas las ventas (para reiniciar)
   * @returns {Promise}
   */
  static async eliminarTodasVentas() {
    try {
      const query = 'DELETE FROM ventas';
      await db.execute(query);
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar ventas:', error);
      throw error;
    }
  }

  /**
   * Obtiene ventas por tipo
   * @param {string} tipo - Tipo de venta (A, B o C)
   * @returns {Promise}
   */
  static async obtenerVentasPorTipo(tipo) {
    try {
      const query = 'SELECT * FROM ventas WHERE tipo = ? ORDER BY fecha DESC';
      const [rows] = await db.execute(query, [tipo]);
      return rows;
    } catch (error) {
      console.error('Error al obtener ventas por tipo:', error);
      throw error;
    }
  }

  /**
   * Obtiene una venta por ID
   * @param {number} id - ID de la venta
   * @returns {Promise}
   */
  static async obtenerVentaPorId(id) {
    try {
      const query = 'SELECT * FROM ventas WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener venta por ID:', error);
      throw error;
    }
  }

  /**
   * Actualiza una venta existente
   * @param {number} id - ID de la venta
   * @param {number} monto - Nuevo monto de la venta
   * @returns {Promise}
   */
  static async actualizarVenta(id, monto) {
    try {
      // Clasificar la venta según el monto
      let tipo;
      if (monto > 1000) {
        tipo = 'A'; // Mayor a $1000
      } else if (monto > 500) {
        tipo = 'B'; // Mayor a $500 pero <= $1000
      } else {
        tipo = 'C'; // Menor o igual a $500
      }

      const query = 'UPDATE ventas SET monto = ?, tipo = ? WHERE id = ?';
      const [result] = await db.execute(query, [monto, tipo, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Venta no encontrada');
      }

      return {
        id,
        monto,
        tipo,
        success: true
      };
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  }

  /**
   * Elimina una venta por ID
   * @param {number} id - ID de la venta
   * @returns {Promise}
   */
  static async eliminarVenta(id) {
    try {
      const query = 'DELETE FROM ventas WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Venta no encontrada');
      }

      return { success: true };
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      throw error;
    }
  }
}

module.exports = VentasModel;
