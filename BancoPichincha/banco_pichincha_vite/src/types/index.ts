export interface Tarjeta {
  id: number;
  clienteId: number;
  cuentaId?: number;
  numeroTarjeta: string;
  tipoTarjeta: 'DEBITO' | 'CREDITO';
  marca: 'VISA' | 'MASTERCARD' | 'AMERICAN_EXPRESS';
  cvv: string;
  fechaExpiracion: string;
  limiteCredito?: number;
  saldoDisponible?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VinculacionDeuna {
  id: number;
  clienteId: number;
  cuentaId: number;
  alias?: string;
  numeroIdentificacion?: string;
  token?: string;
  activo: boolean;
  esPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cuenta {
  id: number;
  clienteId: number;
  numeroCuenta: string;
  tipoCuenta: 'AHORROS' | 'CORRIENTE';
  saldo: number;
  moneda: string;
  activo: boolean;
  limiteTransferencia: number;
  createdAt: string;
  updatedAt: string;
  tarjetas?: Tarjeta[];
  vinculacionesDeuna?: VinculacionDeuna[];
}

export interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  email: string;
  telefono?: string;
  usuario: string;
  password: string;
  codigoDeuna: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  cuentas?: Cuenta[];
  tarjetas?: Tarjeta[];
  vinculacionesDeuna?: VinculacionDeuna[];
}

export interface Transaccion {
  id: number;
  tipoTransaccion: 'RECARGA' | 'TRANSFERENCIA' | 'RETIRO' | 'PAGO';
  origenId?: number;
  destinoId?: number;
  cuentaOrigenId?: number;
  cuentaDestinoId?: number;
  monto: number;
  comision: number;
  montoTotal: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'FALLIDA' | 'REVERSADA';
  descripcion?: string;
  referencia?: string;
  codigoQR?: string;
  fechaExpiracion?: string;
  ipOrigen?: string;
  navegador?: string;
  createdAt: string;
  updatedAt: string;
  clienteOrigen?: Partial<Cliente>;
  clienteDestino?: Partial<Cliente>;
  cuentaOrigen?: Partial<Cuenta>;
  cuentaDestino?: Partial<Cuenta>;
}

export interface LoginResponse {
  ok: boolean;
  msg: string;
  data: Cliente;
}

export interface RegistroResponse {
  ok: boolean;
  msg: string;
  data: Cliente;
}

export interface TransaccionesResponse {
  ok: boolean;
  data: Transaccion[];
}
