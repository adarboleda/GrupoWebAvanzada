import Equipo from '../models/equipo.js';
import Jugador from '../models/jugador.js';

// Crear equipo
export const crearEquipo = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res
        .status(400)
        .json({ error: 'El nombre del equipo es obligatorio' });
    }
    const nuevoEquipo = await Equipo.create({ nombre });
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al crear el equipo', error: error.message });
  }
};

// Listar todos los equipos
export const listarEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        {
          model: Jugador,
          as: 'jugadores',
        },
      ],
    });
    res.json(equipos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al obtener los equipos', error: error.message });
  }
};

// Obtener equipo por ID
export const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id, {
      include: [
        {
          model: Jugador,
          as: 'jugadores',
        },
      ],
    });
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    res.json(equipo);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al obtener el equipo', error: error.message });
  }
};

// Actualizar equipo
export const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    await equipo.update({ nombre });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el equipo',
      error: error.message,
    });
  }
};

// Eliminar equipo
export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id);
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    await equipo.destroy();
    res.json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al eliminar el equipo', error: error.message });
  }
};
