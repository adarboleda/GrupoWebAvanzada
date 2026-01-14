import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const equipoService = {
    // Crear equipo
    crear: async (nombre: string) => {
        try {
            const response = await axios.post(`${API_URL}/equipos`, { nombre });
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.error || error.response?.data?.mensaje || 'Error al crear el equipo'
            };
        }
    },

    // Listar todos los equipos
    listar: async () => {
        try {
            const response = await axios.get(`${API_URL}/equipos`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al obtener equipos'
            };
        }
    },

    // Obtener equipo por ID
    obtenerPorId: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/equipos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al obtener el equipo'
            };
        }
    },

    // Actualizar equipo
    actualizar: async (id: number, nombre: string) => {
        try {
            const response = await axios.put(`${API_URL}/equipos/${id}`, { nombre });
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al actualizar el equipo'
            };
        }
    },

    // Eliminar equipo
    eliminar: async (id: number) => {
        try {
            const response = await axios.delete(`${API_URL}/equipos/${id}`);
            return { ok: true, data: response.data };
        } catch (error: any) {
            return {
                ok: false,
                error: error.response?.data?.mensaje || 'Error al eliminar el equipo'
            };
        }
    }
};
