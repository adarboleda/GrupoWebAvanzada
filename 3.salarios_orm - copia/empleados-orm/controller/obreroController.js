import Obrero from "../models/obrero.js";

//crear el obrero
export const crearObrero = async (req, res) => {
  try {
    const { nombreCompleto, horasTrabajadas } = req.body;
    if (!nombreCompleto || horasTrabajadas == null) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios del obrero" });
    }
    //crear el registro
    const nuevoObrero = await Obrero.create({
      nombreCompleto,
      horasTrabajadas,
    });
    res.status(201).json(nuevoObrero);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear el obrero", error: error.message });
  }
};

//Listar todos los obreros
export const listarObreros = async (req, res) => {
  try {
    const obreros = await Obrero.findAll();
    res.json(obreros);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener los obreros", error: error.message });
  }
};

//Buscar obrero por ID
export const obtenerObreroPorId = async (req, res) => {
  try {
    const { id } = req.params; //obtener el id de la url
    const obrero = await Obrero.findByPk(id);
    if (!obrero) {
      return res.status(404).json({ mensaje: "Obrero no encontrado" });
    }
    res.json(obrero);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el obrero", error: error.message });
  }
};

//Actualizar obrero por ID
export const actualizarObrero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, horasTrabajadas } = req.body;
    const obrero = await Obrero.findByPk(id);
    if (!obrero) {
      return res.status(404).json({ mensaje: "Obrero no encontrado" });
    }
    // obrero.nombreCompleto = nombreCompleto || obrero.nombreCompleto;
    // obrero.horasTrabajadas =
    //   horasTrabajadas != null ? horasTrabajadas : obrero.horasTrabajadas;
    // await obrero.save();
    await obrero.update({ nombreCompleto, horasTrabajadas });
    res.json(obrero);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el obrero", error: error.message });
  }
};

//Eliminar obrero por ID
export const eliminarObrero = async (req, res) => {
  try {
    const { id } = req.params;
    const obrero = await Obrero.findByPk(id);
    if (!obrero) {
      return res.status(404).json({ mensaje: "Obrero no encontrado" });
    }
    await obrero.destroy();
    res.json({ mensaje: "Obrero eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el obrero", error: error.message });
  }
};

// Calcular salario semanal
export const calcularSalarioSemanal = async (req, res) => {
  try {
    const obrero = await Obrero.findByPk(req.params.id);
    if (!obrero)
      return res.status(404).json({ mensaje: "Obrero no encontrado." });

    const salario = obrero.calcularSalario();
    res.json({
      id: obrero.id,
      nombreCompleto: obrero.nombreCompleto,
      horasTrabajadas: obrero.horasTrabajadas,
      ...salario,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al calcular el salario.", error: error.message });
  }
};
