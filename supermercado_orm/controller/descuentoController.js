import Descuento from "../model/descuentoModel.js";

// Crear un nuevo descuento
export const crearDescuento = async (req, res) => {
  try {
    const { monto, numeroEscogido } = req.body;

    if (!monto || numeroEscogido == null) {
      return res.status(400).json({
        error:
          "Faltan datos obligatorios: monto y numeroEscogido son requeridos",
      });
    }

    if (monto <= 0 || numeroEscogido <= 0) {
      return res.status(400).json({
        error: "El monto y el número escogido deben ser valores positivos",
      });
    }

    // Crear el registro en la base de datos
    const nuevoDescuento = await Descuento.create({
      monto,
      numeroEscogido,
    });

    res.status(201).json(nuevoDescuento);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el descuento",
      error: error.message,
    });
  }
};

// Listar todos los descuentos
export const listarDescuentos = async (req, res) => {
  try {
    const descuentos = await Descuento.findAll();
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los descuentos",
      error: error.message,
    });
  }
};

// Buscar descuento por ID
export const obtenerDescuentoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await Descuento.findByPk(id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "Descuento no encontrado" });
    }

    res.json(descuento);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el descuento",
      error: error.message,
    });
  }
};

// Actualizar descuento por ID
export const actualizarDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, numeroEscogido } = req.body;

    const descuento = await Descuento.findByPk(id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "Descuento no encontrado" });
    }

    // Validación de valores positivos
    if (monto !== undefined && monto <= 0) {
      return res.status(400).json({
        error: "El monto debe ser un valor positivo",
      });
    }

    if (numeroEscogido !== undefined && numeroEscogido <= 0) {
      return res.status(400).json({
        error: "El número escogido debe ser un valor positivo",
      });
    }

    // Actualizar el descuento
    await descuento.update({ monto, numeroEscogido });
    res.json(descuento);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar el descuento",
      error: error.message,
    });
  }
};

// Eliminar descuento por ID
export const eliminarDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await Descuento.findByPk(id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "Descuento no encontrado" });
    }

    await descuento.destroy();
    res.json({ mensaje: "Descuento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el descuento",
      error: error.message,
    });
  }
};

// Calcular descuento para una compra
export const calcularDescuentoCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const descuento = await Descuento.findByPk(id);

    if (!descuento) {
      return res.status(404).json({ mensaje: "Descuento no encontrado" });
    }

    // Calcular el descuento usando el método del modelo
    const resultado = descuento.calcularDescuento();

    res.json({
      id: descuento.id,
      ...resultado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al calcular el descuento",
      error: error.message,
    });
  }
};
