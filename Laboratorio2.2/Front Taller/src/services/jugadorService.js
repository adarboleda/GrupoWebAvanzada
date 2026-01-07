import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const jugadorService = {
  // Create
  crear: async (jugadorData) => {
    try {
      const response = await axios.post(`${API_URL}/jugadores`, jugadorData);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al crear jugador'
      };
    }
  },

  // Read all
  obtenerTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/jugadores`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener jugadores'
      };
    }
  },

  // Read by team
  obtenerPorEquipo: async (equipoId) => {
    try {
      const response = await axios.get(`${API_URL}/jugadores?equipoId=${equipoId}`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener jugadores del equipo'
      };
    }
  },

  // Read one
  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/jugadores/${id}`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener jugador'
      };
    }
  },

  // Update
  actualizar: async (id, jugadorData) => {
    try {
      const response = await axios.put(`${API_URL}/jugadores/${id}`, jugadorData);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al actualizar jugador'
      };
    }
  },

  // Delete
  eliminar: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/jugadores/${id}`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al eliminar jugador'
      };
    }
  }
};

export default jugadorService;
