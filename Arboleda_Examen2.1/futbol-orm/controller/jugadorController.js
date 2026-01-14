import Jugador from '../models/jugador.js';
import Equipo from '../models/equipo.js';

// Crear jugador
export const crearJugador = async (req, res) => {
  try {
    const { nombre, id_equipo } = req.body;
    if (!nombre || !id_equipo) {
      return res
        .status(400)
        .json({ error: 'El nombre y el equipo son obligatorios' });
    }

    // Verificar que el equipo existe
    const equipo = await Equipo.findByPk(id_equipo);
    if (!equipo) {
      return res.status(404).json({ error: 'El equipo no existe' });
    }

    const nuevoJugador = await Jugador.create({ nombre, id_equipo });
    res.status(201).json(nuevoJugador);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al crear el jugador', error: error.message });
  }
};

// Listar todos los jugadores
export const listarJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.findAll({
      include: [
        {
          model: Equipo,
          as: 'equipo',
        },
      ],
    });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener los jugadores',
      error: error.message,
    });
  }
};

// Listar jugadores por equipo
export const listarJugadoresPorEquipo = async (req, res) => {
  try {
    const { id_equipo } = req.params;
    const jugadores = await Jugador.findAll({
      where: { id_equipo },
      include: [
        {
          model: Equipo,
          as: 'equipo',
        },
      ],
    });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener los jugadores del equipo',
      error: error.message,
    });
  }
};

// Obtener jugador por ID
export const obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findByPk(id, {
      include: [
        {
          model: Equipo,
          as: 'equipo',
        },
      ],
    });
    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al obtener el jugador', error: error.message });
  }
};

// Actualizar jugador
export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, id_equipo } = req.body;
    const jugador = await Jugador.findByPk(id);
    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }

    // Si se cambia el equipo, verificar que existe
    if (id_equipo && id_equipo !== jugador.id_equipo) {
      const equipo = await Equipo.findByPk(id_equipo);
      if (!equipo) {
        return res.status(404).json({ error: 'El equipo no existe' });
      }
    }

    await jugador.update({ nombre, id_equipo });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el jugador',
      error: error.message,
    });
  }
};

// Eliminar jugador
export const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findByPk(id);
    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    await jugador.destroy();
    res.json({ mensaje: 'Jugador eliminado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: 'Error al eliminar el jugador', error: error.message });
  }
};
