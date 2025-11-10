import { Compra, CompraDetalle } from '../models/compra.js';
import { Arbol } from '../models/arbol.js';
import { sequelize } from '../config/database.js';

const IVA_PORCENTAJE = 15;

// Función para calcular el descuento según la cantidad total de árboles
const calcularDescuentoPorTipo = (arbol, cantidadTotal) => {
  if (cantidadTotal > 300) {
    return parseFloat(arbol.descuento_mas_300);
  } else if (cantidadTotal >= 100 && cantidadTotal <= 300) {
    return parseFloat(arbol.descuento_100_300);
  }
  return 0;
};

// Función para calcular descuento adicional por volumen total
const calcularDescuentoAdicional = (cantidadTotal) => {
  return cantidadTotal > 1000 ? 15 : 0;
};

// Crear una nueva compra con cálculo automático de precios y descuentos
export const crearCompra = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { cliente, arboles } = req.body;

    // Validar datos de entrada
    if (!cliente || !arboles || arboles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar cliente y al menos un tipo de árbol',
      });
    }

    // Calcular cantidad total de árboles
    const cantidadTotal = arboles.reduce((sum, item) => sum + item.cantidad, 0);

    // Crear la compra
    const compra = await Compra.create(
      {
        cliente,
        fecha: new Date(),
      },
      { transaction }
    );

    // Procesar cada tipo de árbol
    const detalles = [];
    let totalCompra = 0;

    for (const item of arboles) {
      const arbol = await Arbol.findByPk(item.arbol_id);

      if (!arbol) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: `Árbol con ID ${item.arbol_id} no encontrado`,
        });
      }

      const cantidad = item.cantidad;
      const precioUnitario = parseFloat(arbol.precio_unitario);

      // Calcular descuento por cantidad de este tipo
      const descuentoPorTipo = calcularDescuentoPorTipo(arbol, cantidad);

      // Calcular descuento adicional si aplica
      const descuentoAdicional = calcularDescuentoAdicional(cantidadTotal);

      // El descuento total es la suma de ambos descuentos
      const descuentoTotal = descuentoPorTipo + descuentoAdicional;

      // Cálculos
      const subtotalSinIva = precioUnitario * cantidad;
      const descuentoMonto = (subtotalSinIva * descuentoTotal) / 100;
      const subtotalConDescuento = subtotalSinIva - descuentoMonto;
      const ivaMonto = (subtotalConDescuento * IVA_PORCENTAJE) / 100;
      const totalFinal = subtotalConDescuento + ivaMonto;

      // Crear detalle de compra
      const detalle = await CompraDetalle.create(
        {
          compra_id: compra.id,
          arbol_id: arbol.id,
          cantidad,
          precio_unitario: precioUnitario,
          descuento_aplicado: descuentoTotal,
          subtotal_sin_iva: subtotalSinIva,
          descuento_monto: descuentoMonto,
          subtotal_con_descuento: subtotalConDescuento,
          iva_monto: ivaMonto,
          total_final: totalFinal,
        },
        { transaction }
      );

      detalles.push(detalle);
      totalCompra += totalFinal;
    }

    await transaction.commit();

    // Obtener la compra completa con detalles y árboles
    const compraCompleta = await Compra.findByPk(compra.id, {
      include: [
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [
            {
              model: Arbol,
              as: 'arbol',
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Compra creada exitosamente',
      data: {
        compra: compraCompleta,
        resumen: {
          cantidad_total_arboles: cantidadTotal,
          descuento_adicional_aplicado:
            calcularDescuentoAdicional(cantidadTotal),
          total_compra: totalCompra.toFixed(2),
        },
      },
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener todas las compras
export const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [
            {
              model: Arbol,
              as: 'arbol',
            },
          ],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    res.status(200).json({
      success: true,
      cantidad: compras.length,
      data: compras,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener una compra por ID
export const obtenerCompraPorId = async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id, {
      include: [
        {
          model: CompraDetalle,
          as: 'detalles',
          include: [
            {
              model: Arbol,
              as: 'arbol',
            },
          ],
        },
      ],
    });

    if (!compra) {
      return res.status(404).json({
        success: false,
        error: 'Compra no encontrada',
      });
    }

    // Calcular resumen
    const cantidadTotal = compra.detalles.reduce(
      (sum, det) => sum + det.cantidad,
      0
    );
    const totalCompra = compra.detalles.reduce(
      (sum, det) => sum + parseFloat(det.total_final),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        compra,
        resumen: {
          cantidad_total_arboles: cantidadTotal,
          total_compra: totalCompra.toFixed(2),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Eliminar una compra
export const eliminarCompra = async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id);
    if (!compra) {
      return res.status(404).json({
        success: false,
        error: 'Compra no encontrada',
      });
    }

    await compra.destroy();
    res.status(200).json({
      success: true,
      message: 'Compra eliminada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
