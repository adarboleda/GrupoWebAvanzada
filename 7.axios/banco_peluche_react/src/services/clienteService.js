import axios from 'axios';

const API_URL = 'http://localhost:3000/api/clientes';

const clienteService = {
  // Crear un nuevo cliente
  crearCliente: async (clienteData) => {
    const response = await axios.post(API_URL, clienteData);
    return response.data;
  },

  // Obtener todos los clientes
  obtenerClientes: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Obtener un cliente por ID
  obtenerClientePorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Actualizar un cliente
  actualizarCliente: async (id, clienteData) => {
    const response = await axios.put(`${API_URL}/${id}`, clienteData);
    return response.data;
  },

  // Eliminar un cliente
  eliminarCliente: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  },

  // Calcular sin guardar (legacy)
  calcular: async (clienteData) => {
    const response = await axios.post(`${API_URL}/calcular`, clienteData);
    return response.data;
  },
};

export default clienteService;
