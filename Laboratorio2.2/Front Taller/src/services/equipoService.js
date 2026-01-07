import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const equipoService = {
  // Create
  crear: async (equipoData) => {
    try {
      const response = await axios.post(`${API_URL}/equipos`, equipoData);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al crear equipo'
      };
    }
  },

  // Read all
  obtenerTodos: async () => {
    try {
      const response = await axios.get(`${API_URL}/equipos`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener equipos'
      };
    }
  },

  // Read one
  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/equipos/${id}`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener equipo'
      };
    }
  },

  // Update
  actualizar: async (id, equipoData) => {
    try {
      const response = await axios.put(`${API_URL}/equipos/${id}`, equipoData);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al actualizar equipo'
      };
    }
  },

  // Delete
  eliminar: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/equipos/${id}`);
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al eliminar equipo'
      };
    }
  }
};

export default equipoService;
