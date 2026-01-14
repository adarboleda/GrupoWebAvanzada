import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const jugadorService = {
    // Crear jugador
    crear: async (nombre: string, id_equipo: number) => {
        try {
            const response = await axios.post(`${API_URL}/jugadores`, { nombre, id_equipo });
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || error.response?.data?.mensaje || 'Error al crear el jugador'
            };
        }
    },

    // Listar todos los jugadores
    listar: async () => {
        try {
            const response = await axios.get(`${API_URL}/jugadores`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al obtener jugadores'
            };
        }
    },

    // Listar jugadores por equipo
    listarPorEquipo: async (id_equipo: number) => {
        try {
            const response = await axios.get(`${API_URL}/jugadores/equipo/${id_equipo}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al obtener jugadores del equipo'
            };
        }
    },

    // Obtener jugador por ID
    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/jugadores/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al obtener el jugador'
            };
        }
    },

    // Actualizar jugador
    actualizar: async (id: number, nombre: string, id_equipo: number) => {
        try {
            const response = await axios.put(`${API_URL}/jugadores/${id}`, { nombre, id_equipo });
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al actualizar el jugador'
            };
        }
    },

    // Eliminar jugador
    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/jugadores/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al eliminar el jugador'
            };
        }
    }
};
