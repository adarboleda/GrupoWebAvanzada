import { Criadero } from "../models/criadero.js";

// Tabla de precios y rebajas según tipo de árbol
const preciosBase = {
    'Paltos': { precio: 1200, rebaja100_300: 0.10, rebaja300plus: 0.18 },
    'Limones': { precio: 1000, rebaja100_300: 0.125, rebaja300plus: 0.20 },
    'Chirimoyos': { precio: 980, rebaja100_300: 0.145, rebaja300plus: 0.19 }
};

const IVA_PORCENTAJE = 0.19;
const REBAJA_ADICIONAL_1000 = 0.15;

// Función auxiliar para calcular la rebaja según cantidad
const calcularPorcentajeRebaja = (tipoArbol, cantidad) => {
    const precios = preciosBase[tipoArbol];
    
    if (cantidad <= 100) {
        return 0;
    } else if (cantidad > 100 && cantidad <= 300) {
        return precios.rebaja100_300;
    } else {
        return precios.rebaja300plus;
    }
};

// Crear compra de árboles con cálculos
export const crearCompra = async (req, res) => {
    try {
        const { tipoArbol, cantidad } = req.body;

        // Validaciones
        if (!tipoArbol || !cantidad) {
            return res.status(400).json({ 
                error: "Debe proporcionar el tipo de árbol y la cantidad" 
            });
        }

        if (!preciosBase[tipoArbol]) {
            return res.status(400).json({ 
                error: "Tipo de árbol no válido. Use: Paltos, Limones o Chirimoyos" 
            });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ 
                error: "La cantidad debe ser mayor a 0" 
            });
        }

        // Obtener precio unitario
        const precioUnitario = preciosBase[tipoArbol].precio;

        // Calcular subtotal sin IVA
        const subtotal = precioUnitario * cantidad;

        // Calcular porcentaje de rebaja según cantidad
        const porcentajeRebaja = calcularPorcentajeRebaja(tipoArbol, cantidad);
        let rebaja = subtotal * porcentajeRebaja;

        // Calcular subtotal después de la primera rebaja
        let subtotalConRebaja = subtotal - rebaja;

        // Aplicar rebaja adicional del 15% si la cantidad es mayor a 1000
        if (cantidad > 1000) {
            const rebajaAdicional = subtotalConRebaja * REBAJA_ADICIONAL_1000;
            rebaja += rebajaAdicional;
            subtotalConRebaja -= rebajaAdicional;
        }

        // Calcular IVA sobre el subtotal con rebaja
        const iva = subtotalConRebaja * IVA_PORCENTAJE;

        // Calcular total a pagar
        const totalPagar = subtotalConRebaja + iva;

        // Crear el registro en la base de datos
        const nuevaCompra = await Criadero.create({
            tipoArbol,
            precioUnitario,
            cantidad,
            rebaja,
            iva,
            totalPagar
        });

        // Respuesta detallada
        res.status(201).json({
            compra: nuevaCompra,
            detalles: {
                subtotalSinIVA: subtotal,
                porcentajeRebajaPorCantidad: (porcentajeRebaja * 100).toFixed(2) + '%',
                rebajaAdicionalMas1000: cantidad > 1000 ? '15%' : 'No aplica',
                rebajaTotal: rebaja.toFixed(2),
                subtotalConRebaja: subtotalConRebaja.toFixed(2),
                ivaAplicado: iva.toFixed(2),
                totalAPagar: totalPagar.toFixed(2)
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las compras
export const obtenerTodasCompras = async (req, res) => {
    try {
        const lista = await Criadero.find();
        res.json(lista);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener compra por ID
export const obtenerCompraPorId = async (req, res) => {
    try {
        const compra = await Criadero.findById(req.params.id);
        if (!compra) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        res.json(compra);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar compra
export const actualizarCompra = async (req, res) => {
    try {
        const { tipoArbol, cantidad } = req.body;

        // Verificar que la compra existe
        const compraExistente = await Criadero.findById(req.params.id);
        if (!compraExistente) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }

        // Validaciones
        if (!tipoArbol || !cantidad) {
            return res.status(400).json({ 
                error: "Debe proporcionar el tipo de árbol y la cantidad" 
            });
        }

        if (!preciosBase[tipoArbol]) {
            return res.status(400).json({ 
                error: "Tipo de árbol no válido. Use: Paltos, Limones o Chirimoyos" 
            });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ 
                error: "La cantidad debe ser mayor a 0" 
            });
        }

        // Obtener precio unitario
        const precioUnitario = preciosBase[tipoArbol].precio;

        // Calcular subtotal sin IVA
        const subtotal = precioUnitario * cantidad;

        // Calcular porcentaje de rebaja según cantidad
        const porcentajeRebaja = calcularPorcentajeRebaja(tipoArbol, cantidad);
        let rebaja = subtotal * porcentajeRebaja;

        // Calcular subtotal después de la primera rebaja
        let subtotalConRebaja = subtotal - rebaja;

        // Aplicar rebaja adicional del 15% si la cantidad es mayor a 1000
        if (cantidad > 1000) {
            const rebajaAdicional = subtotalConRebaja * REBAJA_ADICIONAL_1000;
            rebaja += rebajaAdicional;
            subtotalConRebaja -= rebajaAdicional;
        }

        // Calcular IVA sobre el subtotal con rebaja
        const iva = subtotalConRebaja * IVA_PORCENTAJE;

        // Calcular total a pagar
        const totalPagar = subtotalConRebaja + iva;

        // Actualizar el registro en la base de datos
        const compraActualizada = await Criadero.findByIdAndUpdate(
            req.params.id,
            {
                tipoArbol,
                precioUnitario,
                cantidad,
                rebaja,
                iva,
                totalPagar
            },
            { new: true }
        );

        // Respuesta detallada
        res.json({
            compra: compraActualizada,
            detalles: {
                subtotalSinIVA: subtotal,
                porcentajeRebajaPorCantidad: (porcentajeRebaja * 100).toFixed(2) + '%',
                rebajaAdicionalMas1000: cantidad > 1000 ? '15%' : 'No aplica',
                rebajaTotal: rebaja.toFixed(2),
                subtotalConRebaja: subtotalConRebaja.toFixed(2),
                ivaAplicado: iva.toFixed(2),
                totalAPagar: totalPagar.toFixed(2)
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar compra
export const eliminarCompra = async (req, res) => {
    try {
        const compraEliminada = await Criadero.findByIdAndDelete(req.params.id);
        if (!compraEliminada) {
            return res.status(404).json({ error: "Compra no encontrada" });
        }
        res.json({ message: "Compra eliminada exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

