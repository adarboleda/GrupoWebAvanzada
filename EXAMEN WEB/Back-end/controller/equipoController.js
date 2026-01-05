import Equipo from "../models/equipo.js";
import Jugador from "../models/jugador.js";

// Obtener todos los equipos
export const obtenerEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      where: { activo: true },
      include: [
        {
          model: Jugador,
          as: "jugadores",
          where: { activo: true },
          required: false,
        },
      ],
    });
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    res.status(500).json({ error: "Error al obtener equipos" });
  }
};

// Obtener un equipo por ID
export const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findOne({
      where: { id, activo: true },
      include: [
        {
          model: Jugador,
          as: "jugadores",
          where: { activo: true },
          required: false,
        },
      ],
    });

    if (!equipo) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    res.status(200).json(equipo);
  } catch (error) {
    console.error("Error al obtener equipo:", error);
    res.status(500).json({ error: "Error al obtener equipo" });
  }
};

// Crear un nuevo equipo
export const crearEquipo = async (req, res) => {
  try {
    const { nombre, ciudad, estadio, fundacion, escudo, entrenador } = req.body;

    // Validaciones básicas
    if (!nombre || !ciudad) {
      return res.status(400).json({ error: "Nombre y ciudad son obligatorios" });
    }

    const nuevoEquipo = await Equipo.create({
      nombre,
      ciudad,
      estadio,
      fundacion,
      escudo,
      entrenador,
      activo: true,
    });

    res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error("Error al crear equipo:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Ya existe un equipo con ese nombre" });
    }
    res.status(500).json({ error: "Error al crear equipo" });
  }
};

// Actualizar un equipo
export const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ciudad, estadio, fundacion, escudo, entrenador } = req.body;

    const equipo = await Equipo.findOne({ where: { id, activo: true } });

    if (!equipo) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    await equipo.update({
      nombre: nombre || equipo.nombre,
      ciudad: ciudad || equipo.ciudad,
      estadio: estadio !== undefined ? estadio : equipo.estadio,
      fundacion: fundacion !== undefined ? fundacion : equipo.fundacion,
      escudo: escudo !== undefined ? escudo : equipo.escudo,
      entrenador: entrenador !== undefined ? entrenador : equipo.entrenador,
    });

    res.status(200).json(equipo);
  } catch (error) {
    console.error("Error al actualizar equipo:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Ya existe un equipo con ese nombre" });
    }
    res.status(500).json({ error: "Error al actualizar equipo" });
  }
};

// Eliminar un equipo (eliminación lógica)
export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findOne({ where: { id, activo: true } });

    if (!equipo) {
      return res.status(404).json({ error: "Equipo no encontrado" });
    }

    // Verificar si tiene jugadores activos
    const jugadores = await Jugador.count({ where: { equipoId: id, activo: true } });

    if (jugadores > 0) {
      return res.status(400).json({
        error: "No se puede eliminar el equipo porque tiene jugadores asociados",
      });
    }

    await equipo.update({ activo: false });

    res.status(200).json({ mensaje: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    res.status(500).json({ error: "Error al eliminar equipo" });
  }
};
