import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error en la autenticación',
      };
    }
  },

  register: async (datosUsuario: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, datosUsuario);
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error en el registro',
      };
    }
  },

  verificarToken: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: 'Token inválido',
      };
    }
  },
};

const obtenerToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const headers = () => ({
  Authorization: `Bearer ${obtenerToken()}`,
  'Content-Type': 'application/json',
});

export const cotizacionService = {
  crearCotizacion: async (datos: any) => {
    try {
      const response = await axios.post(`${API_URL}/cotizaciones`, datos, {
        headers: headers(),
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al crear cotización',
      };
    }
  },

  obtenerCotizaciones: async (estado?: string) => {
    try {
      let url = `${API_URL}/cotizaciones`;
      if (estado) {
        url += `?estado=${estado}`;
      }
      const response = await axios.get(url, { headers: headers() });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener cotizaciones',
      };
    }
  },

  obtenerCotizacionPorId: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/cotizaciones/${id}`, {
        headers: headers(),
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener cotización',
      };
    }
  },

  aprobarCotizacion: async (id: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/cotizaciones/${id}/aprobar`,
        {},
        { headers: headers() }
      );
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al aprobar cotización',
      };
    }
  },

  rechazarCotizacion: async (id: string, razonRechazo: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/cotizaciones/${id}/rechazar`,
        { razonRechazo },
        { headers: headers() }
      );
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al rechazar cotización',
      };
    }
  },

  recalcularCotizacion: async (id: string, datos: any) => {
    try {
      const response = await axios.put(`${API_URL}/cotizaciones/${id}/recalcular`, datos, {
        headers: headers(),
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al recalcular cotización',
      };
    }
  },

  obtenerEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/cotizaciones/estadisticas/resumen`, {
        headers: headers(),
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Error al obtener estadísticas',
      };
    }
  },
};
