import axios from 'axios';

const API_URL = 'http://localhost:3000/api/clientes';

const clienteService = {
  // Login - inicia sesión y regenera código DEUNA
  login: async (usuario, password) => {
    const response = await axios.post(`${API_URL}/login`, { usuario, password });
    return response.data;
  },

  // Registro - crear nueva cuenta
  registro: async (clienteData) => {
    const response = await axios.post(`${API_URL}/registro`, clienteData);
    return response.data;
  },

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

  // Buscar cliente por código DEUNA
  buscarPorCodigo: async (codigo) => {
    const response = await axios.get(`${API_URL}/codigo/${codigo}`);
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

  // Depositar saldo
  depositar: async (id, monto, descripcion = '') => {
    const response = await axios.post(`${API_URL}/${id}/depositar`, { monto, descripcion });
    return response.data;
  },

  // Transferir por código DEUNA
  transferir: async (id, codigoDestino, monto, descripcion = '') => {
    const response = await axios.post(`${API_URL}/${id}/transferir`, {
      codigoDestino,
      monto,
      descripcion,
    });
    return response.data;
  },

  // Obtener transacciones de un cliente
  obtenerTransacciones: async (id) => {
    const response = await axios.get(`${API_URL}/${id}/transacciones`);
    return response.data.data || [];
  },

  // Regenerar código DEUNA
  regenerarCodigo: async (id) => {
    const response = await axios.post(`${API_URL}/${id}/regenerar-codigo`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  },
};

export default clienteService;
