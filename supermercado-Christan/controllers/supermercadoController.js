import Supermercado from "../models/supermercado.js";

//crear registro de compra
export const crearCompra = async (req, res) => {
    try {
        const { nombreCliente, montoCompra, numeroAzar } = req.body;
        
        // Validar datos
        if (!nombreCliente || montoCompra === null || numeroAzar === null) {
            return res.status(400).json({ message: "Faltan datos" });
        }
        
        // Validar que sean numéricos y positivos
        if (montoCompra <= 0 || numeroAzar < 0) {
            return res.status(400).json({ message: "Los valores deben ser positivos y números" });
        }
        
        //crear registro
        const nuevaCompra = await Supermercado.create({
            nombreCliente,
            montoCompra,
            numeroAzar
        });
        
        res.status(201).json(nuevaCompra);
    } catch (error) {
        res.status(500).json({ message: "Error al crear compra", error: error.message });
    }
}

//listar todas las compras
export const listarCompras = async (req, res) => {
    try {
        const compras = await Supermercado.findAll();
        res.json(compras);
    } catch (error) {
        res.status(500).json({ message: "Error al listar compras", error: error.message });
    }
}

//Buscar por ID
export const obtenerCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Supermercado.findByPk(id);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        res.json(compra);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar compra", error: error.message });
    }
}

//actualizar compra
export const actualizarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCliente, montoCompra, numeroAzar } = req.body;
        const compra = await Supermercado.findByPk(id);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        await compra.update({
            nombreCliente,
            montoCompra,
            numeroAzar
        });
        res.json(compra);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar compra", error: error.message });
    }
}

//eliminar compra
export const eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Supermercado.findByPk(id);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        await compra.destroy();
        res.json({ message: "Compra eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar compra", error: error.message });
    }
}

// Calcular descuento
export const calcularDescuentoCompra = async (req, res) => {
    try {
        const compra = await Supermercado.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ mensaje: "Compra no encontrada." });
        }

        const resultado = compra.calcularDescuento();
        res.json({
            id: compra.id,
            nombreCliente: compra.nombreCliente,
            ...resultado
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al calcular el descuento.", error: error.message });
    }
};
