const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class JugadorService {
  // Obtener todos los jugadores
  async obtenerJugadores() {
    try {
      const response = await fetch(`${API_URL}/jugadores`);
      if (!response.ok) {
        throw new Error("Error al obtener jugadores");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en obtenerJugadores:", error);
      throw error;
    }
  }

  // Obtener jugadores por equipo
  async obtenerJugadoresPorEquipo(equipoId) {
    try {
      const response = await fetch(`${API_URL}/jugadores/equipo/${equipoId}`);
      if (!response.ok) {
        throw new Error("Error al obtener jugadores del equipo");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en obtenerJugadoresPorEquipo:", error);
      throw error;
    }
  }

  // Obtener un jugador por ID
  async obtenerJugadorPorId(id) {
    try {
      const response = await fetch(`${API_URL}/jugadores/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el jugador");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en obtenerJugadorPorId:", error);
      throw error;
    }
  }

  // Crear un nuevo jugador
  async crearJugador(jugador) {
    try {
      const response = await fetch(`${API_URL}/jugadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jugador),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el jugador");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en crearJugador:", error);
      throw error;
    }
  }

  // Actualizar un jugador
  async actualizarJugador(id, jugador) {
    try {
      const response = await fetch(`${API_URL}/jugadores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jugador),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el jugador");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en actualizarJugador:", error);
      throw error;
    }
  }

  // Eliminar un jugador
  async eliminarJugador(id) {
    try {
      const response = await fetch(`${API_URL}/jugadores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar el jugador");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en eliminarJugador:", error);
      throw error;
    }
  }
}
