import { Cliente } from "../model/Cliente.js";

// Crear cliente
export const crearCliente = async (req, res) => {
    try {
        const { nombre, saldoAnterior, montoCompras, pagoRealizado } = req.body;

        // Validar campos requeridos
        if (!nombre || saldoAnterior === undefined || montoCompras === undefined || pagoRealizado === undefined) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        // Calcular valores
        const saldoBase = saldoAnterior + montoCompras - pagoRealizado;
        const pagoMinimoBase = 0.15 * saldoBase;
        const esMoroso = pagoRealizado < pagoMinimoBase;

        let interes = 0;
        let multa = 0;

        if (esMoroso) {
            interes = 0.12 * saldoBase;
            multa = 200;
        }

        const saldoActual = saldoBase + interes + multa;
        const pagoMinimo = 0.15 * saldoActual;
        const pagoNoIntereses = 0.85 * saldoActual;

        const nuevoCliente = await Cliente.create({
            nombre,
            saldoAnterior: parseFloat(saldoAnterior),
            montoCompras: parseFloat(montoCompras),
            pagoRealizado: parseFloat(pagoRealizado),
            saldoBase,
            pagoMinimoBase,
            esMoroso,
            interes,
            multa,
            saldoActual,
            pagoMinimo,
            pagoNoIntereses
        });

        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener estadísticas (morosos vs no morosos)
export const obtenerEstadisticas = async (req, res) => {
    try {
        const totalClientes = await Cliente.countDocuments();
        const morosos = await Cliente.countDocuments({ esMoroso: true });
        const noMorosos = totalClientes - morosos;

        res.json({
            totalClientes,
            morosos,
            noMorosos,
            porcentajeMorosos: totalClientes > 0 ? ((morosos / totalClientes) * 100).toFixed(2) : 0,
            porcentajeNoMorosos: totalClientes > 0 ? ((noMorosos / totalClientes) * 100).toFixed(2) : 0
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener clientes morosos
export const obtenerMorosos = async (req, res) => {
    try {
        const morosos = await Cliente.find({ esMoroso: true });
        res.json(morosos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener clientes no morosos
export const obtenerNoMorosos = async (req, res) => {
    try {
        const noMorosos = await Cliente.find({ esMoroso: false });
        res.json(noMorosos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar cliente
export const actualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar cliente
export const eliminarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json({ message: "Cliente eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
