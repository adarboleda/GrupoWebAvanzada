import axios from 'axios';
import type {
  Cliente,
  LoginResponse,
  RegistroResponse,
  Transaccion,
} from '../types';

const API_URL = 'http://localhost:3000/api/clientes';

interface RegistroData {
  nombre: string;
  cedula: string;
  email: string;
  telefono?: string;
  usuario: string;
  password: string;
}

const clienteService = {
  // Login - inicia sesión y regenera código DEUNA
  login: async (usuario: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      usuario,
      password,
    });
    return response.data;
  },

  // Registro - crear nueva cuenta
  registro: async (clienteData: RegistroData): Promise<RegistroResponse> => {
    const response = await axios.post<RegistroResponse>(
      `${API_URL}/registro`,
      clienteData,
    );
    return response.data;
  },

  // Crear un nuevo cliente
  crearCliente: async (clienteData: Partial<Cliente>): Promise<Cliente> => {
    const response = await axios.post<Cliente>(API_URL, clienteData);
    return response.data;
  },

  // Obtener todos los clientes
  obtenerClientes: async (): Promise<Cliente[]> => {
    const response = await axios.get<Cliente[]>(API_URL);
    return response.data;
  },

  // Obtener un cliente por ID
  obtenerClientePorId: async (id: number): Promise<Cliente> => {
    const response = await axios.get<{ ok: boolean; data: Cliente }>(
      `${API_URL}/${id}`,
    );
    return response.data.data;
  },

  // Buscar cliente por código DEUNA
  buscarPorCodigo: async (codigo: string): Promise<Cliente> => {
    const response = await axios.get<{
      ok: boolean;
      data: {
        nombre: string;
        codigoDeuna: string;
        id?: number;
        usuario?: string;
      };
    }>(`${API_URL}/codigo/${codigo}`);
    return response.data.data as Cliente;
  },

  // Actualizar un cliente
  actualizarCliente: async (
    id: number,
    clienteData: Partial<Cliente>,
  ): Promise<Cliente> => {
    const response = await axios.put<Cliente>(`${API_URL}/${id}`, clienteData);
    return response.data;
  },

  // Eliminar un cliente
  eliminarCliente: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Depositar saldo (método legacy - recarga primera cuenta)
  depositar: async (
    id: number,
    monto: number,
    descripcion: string = '',
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/depositar`,
      { monto, descripcion },
    );
    return response.data;
  },

  // SERVICIO RECARGA - Recargar saldo vía Deuna
  recarga: async (
    id: number,
    cuentaId: number,
    monto: number,
    descripcion: string = '',
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/recarga`,
      {
        cuentaId,
        monto,
        descripcion,
      },
    );
    return response.data;
  },

  // SERVICIO TRANSFERIR - Transferencia inmediata vía Deuna
  transferirDeuna: async (
    id: number,
    cuentaOrigenId: number,
    codigoDestino: string,
    monto: number,
    descripcion: string = '',
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/transferir-deuna`,
      {
        cuentaOrigenId,
        codigoDestino,
        monto,
        descripcion,
      },
    );
    return response.data;
  },

  // Transferir por código DEUNA (método legacy - usa primera cuenta)
  transferir: async (
    id: number,
    codigoDestino: string,
    monto: number,
    descripcion: string = '',
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/transferir`,
      {
        codigoDestino,
        monto,
        descripcion,
      },
    );
    return response.data;
  },

  // Obtener transacciones de un cliente
  obtenerTransacciones: async (id: number): Promise<Transaccion[]> => {
    const response = await axios.get<{ data: Transaccion[] }>(
      `${API_URL}/${id}/transacciones`,
    );
    return response.data.data || [];
  },

  // Regenerar código DEUNA
  regenerarCodigo: async (id: number): Promise<Cliente> => {
    const response = await axios.post<{
      ok: boolean;
      data: Cliente;
      msg: string;
    }>(`${API_URL}/${id}/regenerar-codigo`);
    return response.data.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/estadisticas`);
    return response.data;
  },

  // SERVICIO GENERAR SOLICITUD DE COBRO (QR)
  generarQR: async (
    id: number,
    cuentaId: number,
    monto: number,
    descripcion: string = '',
    minutosExpiracion: number = 30,
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/generar-qr`,
      {
        cuentaId,
        monto,
        descripcion,
        minutosExpiracion,
      },
    );
    return response.data;
  },

  // SERVICIO PAGAR SOLICITUD DE COBRO (QR)
  pagarQR: async (
    id: number,
    cuentaOrigenId: number,
    codigoQR: string,
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/${id}/pagar-qr`,
      {
        cuentaOrigenId,
        codigoQR,
      },
    );
    return response.data;
  },

  // OBTENER SOLICITUDES DE COBRO PENDIENTES
  obtenerSolicitudesCobro: async (id: number): Promise<Transaccion[]> => {
    const response = await axios.get<{ ok: boolean; data: Transaccion[] }>(
      `${API_URL}/${id}/solicitudes-cobro`,
    );
    return response.data.data || [];
  },

  // REVERSAR TRANSACCIÓN
  reversarTransaccion: async (
    transaccionId: number,
    motivo: string = '',
  ): Promise<any> => {
    const response = await axios.post<{ ok: boolean; data: any; msg: string }>(
      `${API_URL}/transacciones/${transaccionId}/reversar`,
      {
        motivo,
      },
    );
    return response.data;
  },
};

export default clienteService;
