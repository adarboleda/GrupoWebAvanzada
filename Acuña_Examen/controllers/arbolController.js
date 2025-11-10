import Arbol from "../models/arbol.js";

// Configuración de precios 
const tablaPrecios = {
  palto: 1200.0,
  limon: 1000.0,
  chirimoya: 980.0
};

const IVA = 0.12; // 12% IVA

// Lógica de descuento por tipo y rango:
// <=100 -> 0%
// 101-300 -> por tipo: palto 10%, limon 12.5%, chirimoya 14.5%
// >300 -> por tipo: palto 18%, limon 20%, chirimoya 19%
const obtenerPorcentajeDescuentoPorLinea = (tipo, cantidad) => {
  if (cantidad <= 100) return 0;
  const tipoLower = tipo.toLowerCase();
  if (cantidad <= 300) {
    if (tipoLower === "palto") return 0.10;
    if (tipoLower === "limon") return 0.125;
    if (tipoLower === "chirimoya") return 0.145;
  }
  // cantidad > 300
  if (tipoLower === "palto") return 0.18;
  if (tipoLower === "limon") return 0.20;
  if (tipoLower === "chirimoya") return 0.19;
  return 0;
};

// Crear arbol
export const crearArbol = async (req, res) => {
  try {
    const { tipoArbol, cantidad } = req.body;
    if (!tipoArbol || cantidad == null) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    const tipo = tipoArbol.toLowerCase();
    if (!tablaPrecios[tipo]) return res.status(400).json({ mensaje: "Tipo de árbol inválido" });
    if (!Number.isInteger(cantidad) || cantidad < 0) return res.status(400).json({ mensaje: "Cantidad inválida" });

    const precioUnitario = tablaPrecios[tipo];
    const subtotal = precioUnitario * cantidad;

    const descuentoPercent = obtenerPorcentajeDescuentoPorLinea(tipo, cantidad);
    const descuento = subtotal * descuentoPercent;

    // Descuento del 15% si la compra sola excede 1000 
    const extraRebajaLinea = cantidad > 1000 ? (subtotal - descuento) * 0.15 : 0;

    const subtotalDespuesRebajas = subtotal - descuento - extraRebajaLinea;
    const iva = parseFloat((subtotalDespuesRebajas * IVA).toFixed(2));
    const totalPagar = parseFloat((subtotalDespuesRebajas + iva).toFixed(2));

    const nuevo = await Arbol.create({
      tipoArbol: tipo,
      precioUnitario,
      cantidad,
      rebaja: parseFloat((descuento + extraRebajaLinea).toFixed(2)),
      iva,
      totalPagar
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear registro", error: error.message });
  }
};

// listar todos los registros
export const listarArboles = async (req, res) => {
  try {
    const registros = await Arbol.findAll();
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar registros", error: error.message });
  }
};

// Buscar por id
export const obtenerArbol = async (req, res) => {
  try {
    const registro = await Arbol.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    res.json(registro);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar registro", error: error.message });
  }
};

// actualizar registro
export const actualizarArbol = async (req, res) => {
  try {
    const registro = await Arbol.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });

    const { tipoArbol, cantidad } = req.body;
    if (tipoArbol && !tablaPrecios[tipoArbol.toLowerCase()]) return res.status(400).json({ mensaje: "Tipo de árbol inválido" });
    if (cantidad != null && (!Number.isInteger(cantidad) || cantidad < 0)) return res.status(400).json({ mensaje: "Cantidad inválida" });

    // Recalcular y actualizar (si vienen datos)
    const tipo = (tipoArbol || registro.tipoArbol).toLowerCase();
    const cant = cantidad != null ? cantidad : registro.cantidad;
    const precioUnitario = tablaPrecios[tipo];
    const subtotal = precioUnitario * cant;

    const descuentoPercent = obtenerPorcentajeDescuentoPorLinea(tipo, cant);
    const descuento = subtotal * descuentoPercent;
    const extraRebajaLinea = cant > 1000 ? (subtotal - descuento) * 0.15 : 0;
    const subtotalDespuesRebajas = subtotal - descuento - extraRebajaLinea;
    const iva = parseFloat((subtotalDespuesRebajas * IVA).toFixed(2));
    const totalPagar = parseFloat((subtotalDespuesRebajas + iva).toFixed(2));

    await registro.update({
      tipoArbol: tipo,
      precioUnitario,
      cantidad: cant,
      rebaja: parseFloat((descuento + extraRebajaLinea).toFixed(2)),
      iva,
      totalPagar
    });

    res.json(registro);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar registro", error: error.message });
  }
};

// eliminar registro
export const eliminarArbol = async (req, res) => {
  try {
    const registro = await Arbol.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    await registro.destroy();
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar registro", error: error.message });
  }
};

// Calcular compra
export const calcularArboles = async (req, res) => {
  try {
    const payload = req.body;
    let items = [];

    if (Array.isArray(payload?.items)) {
      items = payload.items;
    } else if (payload?.tipoArbol && payload?.cantidad != null) {
      items = [{ tipoArbol: payload.tipoArbol, cantidad: payload.cantidad }];
    } else {
      return res.status(400).json({ mensaje: "Faltan datos" });
    }

    // Validaciones y cálculo por item
    let totalCantidad = 0;
    const detalleItems = [];
    let subtotalAfterLineDiscounts = 0;
    let totalLineDiscounts = 0;

    for (const it of items) {
      if (!it.tipoArbol || it.cantidad == null) return res.status(400).json({ mensaje: "Cada item necesita tipo de Arbol y cantidad" });
      const tipo = it.tipoArbol.toLowerCase();
      const cantidad = it.cantidad;
      if (!tablaPrecios[tipo]) return res.status(400).json({ mensaje: `Tipo de árbol inválido: ${it.tipoArbol}` });
      if (!Number.isInteger(cantidad) || cantidad < 0) return res.status(400).json({ mensaje: "Cantidad inválida en algún item" });

      const precioUnitario = tablaPrecios[tipo];
      const subtotal = precioUnitario * cantidad;

      const discountPercent = obtenerPorcentajeDescuentoPorLinea(tipo, cantidad);
      const discount = subtotal * discountPercent;
      const lineAfterDiscount = subtotal - discount;

      detalleItems.push({
        tipoArbol: tipo,
        cantidad,
        precioUnitario,
        subtotal: parseFloat(subtotal.toFixed(2)),
        descuento: parseFloat(discount.toFixed(2)),
        subtotalDespuesDescuento: parseFloat(lineAfterDiscount.toFixed(2))
      });

      totalCantidad += cantidad;
      totalLineDiscounts += discount;
      subtotalAfterLineDiscounts += lineAfterDiscount;
    }

    // Rebaja adicional del 15% si la compra total supera 1000 árboles (aplica sobre subtotal después de rebajas por línea)
    const extraRebaja = totalCantidad > 1000 ? parseFloat((subtotalAfterLineDiscounts * 0.15).toFixed(2)) : 0;
    const subtotalNeto = parseFloat((subtotalAfterLineDiscounts - extraRebaja).toFixed(2));
    const iva = parseFloat((subtotalNeto * IVA).toFixed(2));
    const totalPagar = parseFloat((subtotalNeto + iva).toFixed(2));
    const totalRebaja = parseFloat((totalLineDiscounts + extraRebaja).toFixed(2));

    res.json({
      items: detalleItems,
      totales: {
        totalCantidad,
        subtotalAntesDescuentos: parseFloat((detalleItems.reduce((s, i) => s + i.subtotal, 0)).toFixed(2)),
        totalRebaja,
        extraRebaja,
        subtotalNeto,
        iva,
        totalPagar
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al calcular la compra.", error: error.message });
  }
};

// Alias de exportación para mantener compatibilidad con rutas existentes
export const crearObrero = crearArbol;
export const listarObreros = listarArboles;
export const obtenerObrero = obtenerArbol;
export const actualizarObrero = actualizarArbol;
export const eliminarObrero = eliminarArbol;
export const calcularSalarioSemanal = calcularArboles;