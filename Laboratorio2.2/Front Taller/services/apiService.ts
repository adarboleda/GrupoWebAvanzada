import axios from 'axios';

// Backend URL - seguro-vehicular-orm runs on port 3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Conductores Service
export const conductorService = {
    crear: async (datos: any) => {
        try {
            const response = await axios.post(`${API_URL}/conductores`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al crear conductor'
            };
        }
    },

    obtenerTodos: async () => {
        try {
            const response = await axios.get(`${API_URL}/conductores`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener conductores'
            };
        }
    },

    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/conductores/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener conductor'
            };
        }
    },

    actualizar: async (id: number, datos: any) => {
        try {
            const response = await axios.put(`${API_URL}/conductores/${id}`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al actualizar conductor'
            };
        }
    },

    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/conductores/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al eliminar conductor'
            };
        }
    }
};

// Vehiculos Service
export const vehiculoService = {
    crear: async (datos: any) => {
        try {
            const response = await axios.post(`${API_URL}/vehiculos`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al crear vehículo'
            };
        }
    },

    obtenerTodos: async () => {
        try {
            const response = await axios.get(`${API_URL}/vehiculos`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener vehículos'
            };
        }
    },

    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/vehiculos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener vehículo'
            };
        }
    },

    actualizar: async (id: number, datos: any) => {
        try {
            const response = await axios.put(`${API_URL}/vehiculos/${id}`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al actualizar vehículo'
            };
        }
    },

    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/vehiculos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al eliminar vehículo'
            };
        }
    }
};

export const cotizacionService = {
    calcular: async (datos: any) => {
        try {
            const response = await axios.post(`${API_URL}/cotizaciones/calcular`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al calcular cotización'
            };
        }
    },

    obtenerTodas: async () => {
        try {
            const response = await axios.get(`${API_URL}/cotizaciones`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener cotizaciones'
            };
        }
    },

    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/cotizaciones/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener cotización'
            };
        }
    },

    obtenerPorConductor: async (id_conductor: number) => {
        try {
            const response = await axios.get(`${API_URL}/cotizaciones/conductor/${id_conductor}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener cotizaciones'
            };
        }
    },

    actualizarEstado: async (id: number, estado: string) => {
        try {
            const response = await axios.put(`${API_URL}/cotizaciones/${id}/estado`, { estado });
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al actualizar estado'
            };
        }
    },

    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/cotizaciones/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al eliminar cotización'
            };
        }
    }
};

// Pagos Service
export const pagoService = {
    procesar: async (datos: any) => {
        try {
            const response = await axios.post(`${API_URL}/pagos/procesar`, datos);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al procesar pago'
            };
        }
    },

    obtenerTodos: async () => {
        try {
            const response = await axios.get(`${API_URL}/pagos`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener pagos'
            };
        }
    },

    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/pagos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener pago'
            };
        }
    },

    obtenerPorCotizacion: async (id_cotizacion: number) => {
        try {
            const response = await axios.get(`${API_URL}/pagos/cotizacion/${id_cotizacion}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al obtener pagos'
            };
        }
    },

    reintentar: async (id_pago: number) => {
        try {
            const response = await axios.post(`${API_URL}/pagos/reintentar/${id_pago}`, {});
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al reintentar pago'
            };
        }
    },

    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/pagos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error al eliminar pago'
            };
        }
    }
};

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || 'Error en la autenticación'
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
                error: error.response?.data?.error || 'Error en el registro'
            };
        }
    },

    verificarToken: async (token: string) => {
        try {
            const response = await axios.get(`${API_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: any) {
            return {
                ok: false,
                error: 'Token inválido'
            };
        }
    }
};
