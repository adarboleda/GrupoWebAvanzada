import { Asignatura } from "../models/asignatura.js";
import { Docente } from "../models/docente.js";

// Crear una nueva asignatura
export const crearAsignatura = async (req, res) => {
  try {
    const { nombre, codigo, creditos, docenteId } = req.body;

    if (!nombre || !codigo || !creditos || !docenteId) {
      return res.status(400).json({
        error:
          "Faltan datos obligatorios: nombre, codigo, creditos y docenteId son requeridos",
      });
    }

    const nuevaAsignatura = await Asignatura.create({
      nombre,
      codigo,
      creditos,
      docenteId,
    });
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear la asignatura", mensaje: error.message });
  }
};

// Listar todas las asignaturas
export const listarAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({
      include: [{ model: Docente }],
    });
    res.json(asignaturas);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al listar las asignaturas",
        mensaje: error.message,
      });
  }
};

// Obtener una asignatura por ID
export const obtenerAsignaturaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id, {
      include: [{ model: Docente }],
    });

    if (asignatura) {
      res.json(asignatura);
    } else {
      res.status(404).json({ error: "Asignatura no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener la asignatura",
        mensaje: error.message,
      });
  }
};

// Actualizar una asignatura por ID
export const actualizarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, creditos, docenteId } = req.body;
    const asignatura = await Asignatura.findByPk(id);

    if (asignatura) {
      asignatura.nombre = nombre || asignatura.nombre;
      asignatura.codigo = codigo || asignatura.codigo;
      asignatura.creditos = creditos || asignatura.creditos;
      asignatura.docenteId = docenteId || asignatura.docenteId;
      await asignatura.save();
      res.json(asignatura);
    } else {
      res.status(404).json({ error: "Asignatura no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar la asignatura",
        mensaje: error.message,
      });
  }
};

// Eliminar una asignatura por ID
export const eliminarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id);

    if (asignatura) {
      await asignatura.destroy();
      res.json({ mensaje: "Asignatura eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Asignatura no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al eliminar la asignatura",
        mensaje: error.message,
      });
  }
};
