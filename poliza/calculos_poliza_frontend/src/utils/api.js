import axios from 'axios';

const API_BASE = 'http://localhost:8087/api';

export const polizasAPI = {
  // Obtener todas las pólizas
  obtenerTodas: async () => {
    try {
      const response = await axios.get(`${API_BASE}/polizas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pólizas:', error);
      return [];
    }
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    try {
      const [total, recaudo] = await Promise.all([
        axios.get(`${API_BASE}/polizas/estadisticas/total`),
        axios.get(`${API_BASE}/polizas/estadisticas/recaudo`)
      ]);
      return {
        totalPolizas: total.data,
        recaudoTotal: recaudo.data
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalPolizas: 0,
        recaudoTotal: 0
      };
    }
  },

  // Obtener póliza por ID
  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/polizas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo póliza:', error);
      return null;
    }
  },

  // Eliminar póliza
  eliminar: async (id) => {
    try {
      await axios.delete(`${API_BASE}/polizas/${id}`);
      return true;
    } catch (error) {
      console.error('Error eliminando póliza:', error);
      return false;
    }
  }
};
