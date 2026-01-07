import { Jugador } from '../models/jugador.js';
import { Equipo } from '../models/equipo.js';

// CREATE - Crear nuevo jugador
export const crearJugador = async (req, res) => {
  try {
    const { nombre, posicion, numero, equipoId } = req.body;

    if (!nombre || !posicion || !numero || !equipoId) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios',
      });
    }

    // Validar que el equipo existe
    const equipo = await Equipo.findByPk(equipoId);
    if (!equipo) {
      return res.status(404).json({
        error: 'Equipo no encontrado',
      });
    }

    // Validar número único por equipo
    const jugadorExistente = await Jugador.findOne({
      where: { equipoId, numero },
    });

    if (jugadorExistente) {
      return res.status(400).json({
        error: 'El número ya está asignado a otro jugador en este equipo',
      });
    }

    const nuevoJugador = await Jugador.create({
      nombre,
      posicion,
      numero,
      equipoId,
    });

    res.status(201).json({
      mensaje: 'Jugador creado exitosamente',
      jugador: nuevoJugador,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el jugador',
      detalle: error.message,
    });
  }
};

// READ - Obtener todos los jugadores
export const obtenerJugadores = async (req, res) => {
  try {
    const { equipoId } = req.query;

    const filtro = equipoId ? { where: { equipoId } } : {};

    const jugadores = await Jugador.findAll({
      ...filtro,
      include: {
        model: Equipo,
        as: 'equipo',
      },
    });

    res.status(200).json(jugadores);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener jugadores',
      detalle: error.message,
    });
  }
};

// READ - Obtener jugador por ID
export const obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findByPk(id, {
      include: {
        model: Equipo,
        as: 'equipo',
      },
    });

    if (!jugador) {
      return res.status(404).json({
        error: 'Jugador no encontrado',
      });
    }

    res.status(200).json(jugador);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el jugador',
      detalle: error.message,
    });
  }
};

// UPDATE - Actualizar jugador
export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, posicion, numero, equipoId } = req.body;

    const jugador = await Jugador.findByPk(id);

    if (!jugador) {
      return res.status(404).json({
        error: 'Jugador no encontrado',
      });
    }

    // Si se cambia el equipo, validar que existe
    if (equipoId && equipoId !== jugador.equipoId) {
      const equipo = await Equipo.findByPk(equipoId);
      if (!equipo) {
        return res.status(404).json({
          error: 'Equipo no encontrado',
        });
      }
    }

    // Validar número único por equipo si cambia
    if (numero && numero !== jugador.numero) {
      const equipoAValidar = equipoId || jugador.equipoId;
      const jugadorExistente = await Jugador.findOne({
        where: { equipoId: equipoAValidar, numero },
      });

      if (jugadorExistente) {
        return res.status(400).json({
          error: 'El número ya está asignado a otro jugador en este equipo',
        });
      }
    }

    await jugador.update({
      nombre: nombre || jugador.nombre,
      posicion: posicion || jugador.posicion,
      numero: numero || jugador.numero,
      equipoId: equipoId || jugador.equipoId,
    });

    res.status(200).json({
      mensaje: 'Jugador actualizado exitosamente',
      jugador,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el jugador',
      detalle: error.message,
    });
  }
};

// DELETE - Eliminar jugador
export const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findByPk(id);

    if (!jugador) {
      return res.status(404).json({
        error: 'Jugador no encontrado',
      });
    }

    await jugador.destroy();

    res.status(200).json({
      mensaje: 'Jugador eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el jugador',
      detalle: error.message,
    });
  }
};
