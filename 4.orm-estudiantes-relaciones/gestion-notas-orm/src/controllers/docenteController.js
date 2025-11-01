import { Docente } from "../models/docente.js";
import { Asignatura } from "../models/asignatura.js";

// Crear un nuevo docente
export const crearDocente = async (req, res) => {
  try {
    const { nombre, apellido, email, especialidad } = req.body;

    if (!nombre || !apellido || !email) {
      return res
        .status(400)
        .json({
          error:
            "Faltan datos obligatorios: nombre, apellido y email son requeridos",
        });
    }

    const nuevoDocente = await Docente.create({
      nombre,
      apellido,
      email,
      especialidad,
    });
    res.status(201).json(nuevoDocente);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el docente", mensaje: error.message });
  }
};

// Listar todos los docentes
export const listarDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: [{ model: Asignatura }],
    });
    res.json(docentes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al listar los docentes", mensaje: error.message });
  }
};

// Obtener un docente por ID
export const obtenerDocentePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findByPk(id, {
      include: [{ model: Asignatura }],
    });

    if (docente) {
      res.json(docente);
    } else {
      res.status(404).json({ error: "Docente no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el docente", mensaje: error.message });
  }
};

// Actualizar un docente por ID
export const actualizarDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, especialidad } = req.body;
    const docente = await Docente.findByPk(id);

    if (docente) {
      docente.nombre = nombre || docente.nombre;
      docente.apellido = apellido || docente.apellido;
      docente.email = email || docente.email;
      docente.especialidad = especialidad || docente.especialidad;
      await docente.save();
      res.json(docente);
    } else {
      res.status(404).json({ error: "Docente no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar el docente",
        mensaje: error.message,
      });
  }
};

// Eliminar un docente por ID
export const eliminarDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findByPk(id);

    if (docente) {
      await docente.destroy();
      res.json({ mensaje: "Docente eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Docente no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el docente", mensaje: error.message });
  }
};
