import { Equipo } from '../models/equipo.js';
import { Jugador } from '../models/jugador.js';

// CREATE - Crear nuevo equipo
export const crearEquipo = async (req, res) => {
  try {
    const { nombre, ciudad } = req.body;

    if (!nombre || !ciudad) {
      return res.status(400).json({
        error: 'El nombre y la ciudad son obligatorios',
      });
    }

    const nuevoEquipo = await Equipo.create({
      nombre,
      ciudad,
    });

    res.status(201).json({
      mensaje: 'Equipo creado exitosamente',
      equipo: nuevoEquipo,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el equipo',
      detalle: error.message,
    });
  }
};

// READ - Obtener todos los equipos
export const obtenerEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: {
        model: Jugador,
        as: 'jugadores',
      },
    });

    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener equipos',
      detalle: error.message,
    });
  }
};

// READ - Obtener equipo por ID
export const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id, {
      include: {
        model: Jugador,
        as: 'jugadores',
      },
    });

    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado',
      });
    }

    res.status(200).json(equipo);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el equipo',
      detalle: error.message,
    });
  }
};

// UPDATE - Actualizar equipo
export const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ciudad } = req.body;

    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado',
      });
    }

    await equipo.update({
      nombre: nombre || equipo.nombre,
      ciudad: ciudad || equipo.ciudad,
    });

    res.status(200).json({
      mensaje: 'Equipo actualizado exitosamente',
      equipo,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el equipo',
      detalle: error.message,
    });
  }
};

// DELETE - Eliminar equipo
export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado',
      });
    }

    // Eliminar todos los jugadores del equipo
    await Jugador.destroy({
      where: { equipoId: id },
    });

    await equipo.destroy();

    res.status(200).json({
      mensaje: 'Equipo eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el equipo',
      detalle: error.message,
    });
  }
};
