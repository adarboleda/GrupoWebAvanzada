import { Estudiante } from "../models/estudiante.js";

// Crear un nuevo estudiante
export const crearEstudiante = async (req, res) => {
  try {
    const { nombre, carrera } = req.body;
    if (!nombre || !carrera) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    const nuevoEstudiante = await Estudiante.create({ nombre, carrera });
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el estudiante" });
  }
};

// Listar todos los estudiantes
export const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: "Error al listar los estudiantes" });
  }
};

// Obtener un estudiante por ID
export const obtenerEstudiantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      res.status(200).json(estudiante);
    } else {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el estudiante" });
  }
};

// Actualizar un estudiante por ID
export const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, carrera } = req.body;
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      estudiante.nombre = nombre || estudiante.nombre;
      estudiante.carrera = carrera || estudiante.carrera;
      await estudiante.save();
      res.status(200).json(estudiante);
    } else {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estudiante" });
  }
};

// Eliminar un estudiante por ID
export const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      await estudiante.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el estudiante" });
  }
};
