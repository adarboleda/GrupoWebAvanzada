import Jugador from "../models/jugador.js";
import Equipo from "../models/equipo.js";

// Obtener todos los jugadores
export const obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.findAll({
      where: { activo: true },
      include: [
        {
          model: Equipo,
          as: "equipo",
          attributes: ["id", "nombre", "ciudad", "escudo"],
        },
      ],
    });
    res.status(200).json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
};

// Obtener jugadores por equipo
export const obtenerJugadoresPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;

    const jugadores = await Jugador.findAll({
      where: { equipoId, activo: true },
      include: [
        {
          model: Equipo,
          as: "equipo",
          attributes: ["id", "nombre", "ciudad", "escudo"],
        },
      ],
    });

    res.status(200).json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores por equipo:", error);
    res.status(500).json({ error: "Error al obtener jugadores por equipo" });
  }
};

// Obtener un jugador por ID
export const obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findOne({
      where: { id, activo: true },
      include: [
        {
          model: Equipo,
          as: "equipo",
          attributes: ["id", "nombre", "ciudad", "escudo"],
        },
      ],
    });

    if (!jugador) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    res.status(200).json(jugador);
  } catch (error) {
    console.error("Error al obtener jugador:", error);
    res.status(500).json({ error: "Error al obtener jugador" });
  }
};

// Crear un nuevo jugador
export const crearJugador = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      fechaNacimiento,
      nacionalidad,
      posicion,
      numeroCamiseta,
      foto,
      equipoId,
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !posicion || !equipoId) {
      return res.status(400).json({
        error: "Nombre, apellido, posición y equipo son obligatorios",
      });
    }

    // Verificar que el equipo existe
    const equipo = await Equipo.findOne({ where: { id: equipoId, activo: true } });
    if (!equipo) {
      return res.status(404).json({ error: "El equipo especificado no existe" });
    }

    // Verificar que el número de camiseta no esté ocupado en el equipo
    if (numeroCamiseta) {
      const camisetaOcupada = await Jugador.findOne({
        where: { equipoId, numeroCamiseta, activo: true },
      });
      if (camisetaOcupada) {
        return res.status(400).json({
          error: `El número de camiseta ${numeroCamiseta} ya está ocupado en este equipo`,
        });
      }
    }

    const nuevoJugador = await Jugador.create({
      nombre,
      apellido,
      fechaNacimiento,
      nacionalidad,
      posicion,
      numeroCamiseta,
      foto,
      equipoId,
      activo: true,
    });

    // Obtener el jugador con el equipo incluido
    const jugadorCompleto = await Jugador.findByPk(nuevoJugador.id, {
      include: [
        {
          model: Equipo,
          as: "equipo",
          attributes: ["id", "nombre", "ciudad", "escudo"],
        },
      ],
    });

    res.status(201).json(jugadorCompleto);
  } catch (error) {
    console.error("Error al crear jugador:", error);
    res.status(500).json({ error: "Error al crear jugador" });
  }
};

// Actualizar un jugador
export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      fechaNacimiento,
      nacionalidad,
      posicion,
      numeroCamiseta,
      foto,
      equipoId,
    } = req.body;

    const jugador = await Jugador.findOne({ where: { id, activo: true } });

    if (!jugador) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    // Si se cambia de equipo, verificar que el nuevo equipo existe
    if (equipoId && equipoId !== jugador.equipoId) {
      const equipo = await Equipo.findOne({ where: { id: equipoId, activo: true } });
      if (!equipo) {
        return res.status(404).json({ error: "El equipo especificado no existe" });
      }
    }

    // Si se cambia el número de camiseta, verificar que no esté ocupado
    if (numeroCamiseta && numeroCamiseta !== jugador.numeroCamiseta) {
      const equipoFinal = equipoId || jugador.equipoId;
      const camisetaOcupada = await Jugador.findOne({
        where: { equipoId: equipoFinal, numeroCamiseta, activo: true },
      });
      if (camisetaOcupada && camisetaOcupada.id !== jugador.id) {
        return res.status(400).json({
          error: `El número de camiseta ${numeroCamiseta} ya está ocupado en este equipo`,
        });
      }
    }

    await jugador.update({
      nombre: nombre || jugador.nombre,
      apellido: apellido || jugador.apellido,
      fechaNacimiento:
        fechaNacimiento !== undefined ? fechaNacimiento : jugador.fechaNacimiento,
      nacionalidad: nacionalidad !== undefined ? nacionalidad : jugador.nacionalidad,
      posicion: posicion || jugador.posicion,
      numeroCamiseta:
        numeroCamiseta !== undefined ? numeroCamiseta : jugador.numeroCamiseta,
      foto: foto !== undefined ? foto : jugador.foto,
      equipoId: equipoId || jugador.equipoId,
    });

    // Obtener el jugador actualizado con el equipo incluido
    const jugadorActualizado = await Jugador.findByPk(jugador.id, {
      include: [
        {
          model: Equipo,
          as: "equipo",
          attributes: ["id", "nombre", "ciudad", "escudo"],
        },
      ],
    });

    res.status(200).json(jugadorActualizado);
  } catch (error) {
    console.error("Error al actualizar jugador:", error);
    res.status(500).json({ error: "Error al actualizar jugador" });
  }
};

// Eliminar un jugador (eliminación lógica)
export const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findOne({ where: { id, activo: true } });

    if (!jugador) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    await jugador.update({ activo: false });

    res.status(200).json({ mensaje: "Jugador eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar jugador:", error);
    res.status(500).json({ error: "Error al eliminar jugador" });
  }
};
