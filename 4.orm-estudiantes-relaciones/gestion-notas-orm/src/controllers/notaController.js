import { Nota } from "../models/nota.js";
import { Estudiante } from "../models/estudiante.js";
import { Asignatura } from "../models/asignatura.js";
import { Docente } from "../models/docente.js";

// Procesos funcionales

function enRango(nota) {
  if (typeof nota == "number" && nota >= 0 && nota <= 20) {
    return true;
  } else {
    return false;
  }
}

// Calcular el promedio
function calcularPromedio(nota1, nota2, nota3) {
  const suma = nota1 + nota2 + nota3;
  const promedio = suma / 3;
  return Number(promedio.toFixed(2));
}

// Determinar la categoría según el promedio
function categoriaPromedio(promedio) {
  if (promedio >= 18) {
    return "Sobresaliente";
  } else if (promedio >= 14) {
    return "Aprobado";
  } else {
    return "Reprobado";
  }
}

//crear una nueva nota
export const crearNota = async (req, res) => {
  try {
    const { asignaturaId, nota1, nota2, nota3, estudianteId } = req.body;

    // Validar datos obligatorios
    if (
      !asignaturaId ||
      [nota1, nota2, nota3].some((n) => n === undefined) ||
      !estudianteId
    ) {
      return res.status(400).json({
        error:
          "Faltan datos obligatorios: asignaturaId, nota1, nota2, nota3 y estudianteId son requeridos",
      });
    }

    // Validar que las notas estén en el rango correcto
    if (![nota1, nota2, nota3].every(enRango)) {
      return res.status(400).json({
        error: "Las notas deben estar en el rango de 0 a 20",
      });
    }

    // Llamar a las funciones para calcular promedio y categoría
    const promedio = calcularPromedio(nota1, nota2, nota3);
    const categoria = categoriaPromedio(promedio);

    // Verificar si ya existe una nota para este estudiante en esta asignatura
    const notaExistente = await Nota.findOne({
      where: { estudianteId, asignaturaId },
    });

    if (notaExistente) {
      return res.status(400).json({
        error:
          "Este estudiante ya tiene una nota registrada en esta asignatura. Use PUT para actualizar.",
      });
    }

    // Crear el registro en la base de datos
    const nuevaNota = await Nota.create({
      asignaturaId,
      nota1,
      nota2,
      nota3,
      promedio,
      categoria,
      estudianteId,
    });

    res.status(201).json(nuevaNota);
  } catch (error) {
    // Manejar error de clave única duplicada
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error:
          "Este estudiante ya tiene una nota registrada en esta asignatura",
      });
    }

    res.status(500).json({
      mensaje: "Error al crear la nota",
      error: error.message,
    });
  }
};

// Listar todas las notas
export const listarNotas = async (req, res) => {
  try {
    const notas = await Nota.findAll({
      include: [
        { model: Estudiante },
        {
          model: Asignatura,
          include: [{ model: Docente }],
        },
      ],
    });
    res.json(notas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las notas",
      error: error.message,
    });
  }
};

// Buscar nota por ID
export const obtenerNotaPorId = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.id, {
      include: [
        { model: Estudiante },
        {
          model: Asignatura,
          include: [{ model: Docente }],
        },
      ],
    });

    if (!nota) {
      return res.status(404).json({ mensaje: "Nota no encontrada" });
    }

    res.json(nota);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la nota",
      error: error.message,
    });
  }
};

export const actualizarNota = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.id);
    if (!nota) return res.status(404).json({ mensaje: "No existe" });

    // Permitir actualizar cualquier campo; si vienen las 3 notas, recalculamos.
    const { nota1, nota2, nota3 } = req.body;
    let payload = { ...req.body };

    if ([nota1, nota2, nota3].every((n) => n !== undefined)) {
      if (![nota1, nota2, nota3].every(enRango)) {
        return res
          .status(400)
          .json({ mensaje: "Las notas deben estar entre 0 y 20." });
      }
      const promedio = calcularPromedio(nota1, nota2, nota3);
      const categoria = categoriaPromedio(promedio);
      payload.promedio = promedio;
      payload.categoria = categoria;
    }

    await nota.update(payload);
    res.json(nota);
  } catch (e) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la nota", error: e.message });
  }
};

// Eliminar nota por ID
export const eliminarNota = async (req, res) => {
  try {
    const nota = await Nota.findByPk(req.params.id);

    if (!nota) {
      return res.status(404).json({ mensaje: "Nota no encontrada" });
    }

    await nota.destroy();

    res.json({ mensaje: "Nota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar la nota",
      error: error.message,
    });
  }
};
