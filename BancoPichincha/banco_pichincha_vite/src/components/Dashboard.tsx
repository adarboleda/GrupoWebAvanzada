import { useState, useEffect, type FormEvent, type MouseEvent } from 'react';
import {
  Home,
  User,
  PiggyBank,
  Send,
  Settings,
  Lock,
  RefreshCw,
  Copy,
  Check,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Inbox,
  X,
  QrCode,
  Scan,
  CreditCard,
  Link2,
  Wallet,
  Building,
} from 'lucide-react';
import clienteService from '../services/clienteService';
import type { Cliente, Transaccion } from '../types';
import './Dashboard.css';

interface DashboardProps {
  cliente: Cliente;
  onLogout: () => void;
  onClienteUpdate: (cliente: Cliente) => void;
}

interface ComprobanteData {
  tipo: 'RECARGA' | 'TRANSFERENCIA' | 'PAGO_QR';
  referencia: string;
  fecha: string;
  monto: number;
  comision: number;
  montoTotal: number;
  descripcion: string;
  destinatario?: string;
  cuentaOrigen?: string;
  cuentaDestino?: string;
}

function Dashboard({ cliente, onLogout, onClienteUpdate }: DashboardProps) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'inicio' | 'mi-cuenta'>(
    'inicio',
  );
  const [modalDeposito, setModalDeposito] = useState(false);
  const [modalTransferencia, setModalTransferencia] = useState(false);
  const [modalGenerarQR, setModalGenerarQR] = useState(false);
  const [modalPagarQR, setModalPagarQR] = useState(false);
  const [montoDeposito, setMontoDeposito] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [montoQR, setMontoQR] = useState('');
  const [descripcionQR, setDescripcionQR] = useState('');
  const [codigoQRGenerado, setCodigoQRGenerado] = useState('');
  const [codigoQRPagar, setCodigoQRPagar] = useState('');
  const [codigoDestino, setCodigoDestino] = useState('');
  const [destinatario, setDestinatario] = useState<Cliente | null>(null);
  const [errorDestino, setErrorDestino] = useState('');
  const [loading, setLoading] = useState(false);
  const [codigoCopied, setCodigoCopied] = useState(false);
  const [qrCopied, setQRCopied] = useState(false);
  const [errorMonto, setErrorMonto] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<number | null>(
    null,
  );
  const [modalComprobante, setModalComprobante] = useState(false);
  const [comprobanteData, setComprobanteData] =
    useState<ComprobanteData | null>(null);

  useEffect(() => {
    cargarTransacciones();
    // Seleccionar la primera cuenta por defecto
    if (cliente.cuentas && cliente.cuentas.length > 0 && !cuentaSeleccionada) {
      setCuentaSeleccionada(cliente.cuentas[0].id);
    }
  }, [cliente.id, cliente.cuentas]);

  const cargarTransacciones = async () => {
    try {
      const data = await clienteService.obtenerTransacciones(cliente.id);
      setTransacciones(data);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    }
  };

  const actualizarSaldo = async () => {
    try {
      const clienteActualizado = await clienteService.obtenerClientePorId(
        cliente.id,
      );
      onClienteUpdate(clienteActualizado);
      cargarTransacciones();
    } catch (error) {
      console.error('Error actualizando saldo:', error);
    }
  };

  const obtenerSaldoTotal = () => {
    if (!cliente.cuentas || cliente.cuentas.length === 0) return 0;
    return cliente.cuentas.reduce(
      (total, cuenta) => total + parseFloat(cuenta.saldo.toString()),
      0,
    );
  };

  const obtenerCuentaActual = () => {
    if (!cliente.cuentas || cliente.cuentas.length === 0) return null;
    return (
      cliente.cuentas.find((c) => c.id === cuentaSeleccionada) ||
      cliente.cuentas[0]
    );
  };

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(cliente.codigoDeuna);
      setCodigoCopied(true);
      setTimeout(() => setCodigoCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando código:', error);
    }
  };

  const regenerarCodigo = async () => {
    try {
      const clienteActualizado = await clienteService.regenerarCodigo(
        cliente.id,
      );
      onClienteUpdate(clienteActualizado);
    } catch (error) {
      console.error('Error regenerando código:', error);
    }
  };

  // Generar QR para cobro
  const generarQR = async (e: FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoQR);
    if (isNaN(monto) || monto <= 0) return;

    const cuentaActual = obtenerCuentaActual();
    if (!cuentaActual) {
      setErrorMonto('No tienes cuentas activas');
      return;
    }

    try {
      setLoading(true);
      const resultado = await clienteService.generarQR(
        cliente.id,
        cuentaActual.id,
        monto,
        descripcionQR,
        30, // 30 minutos de expiración
      );
      setCodigoQRGenerado(resultado.data.codigoQR);
      setMensajeExito(
        `Solicitud de cobro creada por $${monto}. Comparte el código QR.`,
      );
    } catch (error) {
      console.error('Error generando QR:', error);
      setErrorMonto('Error al generar solicitud de cobro');
    } finally {
      setLoading(false);
    }
  };

  // Pagar QR
  const procesarPagoQR = async (e: FormEvent) => {
    e.preventDefault();
    if (!codigoQRPagar.trim()) return;

    const cuentaActual = obtenerCuentaActual();
    if (!cuentaActual) {
      setErrorDestino('No tienes cuentas activas');
      return;
    }

    try {
      setLoading(true);
      const resultado = await clienteService.pagarQR(
        cliente.id,
        cuentaActual.id,
        codigoQRPagar,
      );
      await actualizarSaldo();
      setModalPagarQR(false);
      setCodigoQRPagar('');

      // Mostrar comprobante
      const transaccion = resultado.data?.transaccion;
      if (transaccion) {
        setComprobanteData({
          tipo: 'PAGO_QR',
          referencia: transaccion.referencia || 'N/A',
          fecha: new Date().toISOString(),
          monto: transaccion.monto || 0,
          comision: transaccion.comision || 0,
          montoTotal: transaccion.montoTotal || 0,
          descripcion: transaccion.descripcion || 'Pago con código QR',
          cuentaOrigen: `****${cuentaActual.numeroCuenta.slice(-4)}`,
          destinatario: resultado.data?.solicitud?.descripcion || 'Comercio',
        });
        setModalComprobante(true);
      }
    } catch (error: unknown) {
      console.error('Error pagando QR:', error);
      const axiosError = error as {
        response?: { data?: { msg?: string } };
      };
      setErrorDestino(
        axiosError.response?.data?.msg || 'Error al procesar pago',
      );
    } finally {
      setLoading(false);
    }
  };

  // Copiar código QR
  const copiarQR = async () => {
    try {
      await navigator.clipboard.writeText(codigoQRGenerado);
      setQRCopied(true);
      setTimeout(() => setQRCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando QR:', error);
    }
  };

  const buscarDestinatario = async () => {
    if (codigoDestino.length !== 8) {
      setErrorDestino('El código debe tener 8 caracteres');
      return;
    }
    try {
      setLoading(true);
      const resultado = await clienteService.buscarPorCodigo(codigoDestino);
      if (resultado.id === cliente.id) {
        setErrorDestino('No puedes transferirte a ti mismo');
        setDestinatario(null);
      } else {
        setDestinatario(resultado);
        setErrorDestino('');
      }
    } catch {
      setErrorDestino('No se encontró ningún usuario con ese código');
      setDestinatario(null);
    } finally {
      setLoading(false);
    }
  };

  const realizarDeposito = async (e: FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoDeposito);
    if (isNaN(monto) || monto <= 0) return;

    const cuentaActual = obtenerCuentaActual();
    if (!cuentaActual) {
      setErrorMonto('No tienes cuentas activas');
      return;
    }

    try {
      setLoading(true);
      const resultado = await clienteService.recarga(
        cliente.id,
        cuentaActual.id,
        monto,
        'Recarga de saldo vía Deuna',
      );
      await actualizarSaldo();
      setModalDeposito(false);
      setMontoDeposito('');

      // Mostrar comprobante
      const transaccion = resultado.data?.transaccion;
      if (transaccion) {
        setComprobanteData({
          tipo: 'RECARGA',
          referencia: transaccion.referencia || 'N/A',
          fecha: new Date().toISOString(),
          monto: transaccion.monto || monto,
          comision: transaccion.comision || 0,
          montoTotal: transaccion.montoTotal || monto,
          descripcion: transaccion.descripcion || 'Recarga de saldo vía Deuna',
          cuentaDestino: `****${cuentaActual.numeroCuenta.slice(-4)}`,
        });
        setModalComprobante(true);
      }
    } catch (error) {
      console.error('Error en depósito:', error);
      setErrorMonto('Error al realizar la recarga');
    } finally {
      setLoading(false);
    }
  };

  const realizarTransferencia = async (e: FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoTransferencia);
    if (isNaN(monto) || monto <= 0 || !destinatario) return;

    const cuentaActual = obtenerCuentaActual();
    if (!cuentaActual) {
      setErrorDestino('No tienes cuentas activas');
      return;
    }

    const nombreDestinatario = destinatario.nombre;
    try {
      setLoading(true);
      const resultado = await clienteService.transferirDeuna(
        cliente.id,
        cuentaActual.id,
        codigoDestino,
        monto,
        'Transferencia vía Deuna',
      );
      await actualizarSaldo();
      setModalTransferencia(false);
      setMontoTransferencia('');
      setCodigoDestino('');
      setDestinatario(null);

      // Mostrar comprobante
      const transaccion = resultado.data?.transaccion;
      if (transaccion) {
        setComprobanteData({
          tipo: 'TRANSFERENCIA',
          referencia: transaccion.referencia || 'N/A',
          fecha: new Date().toISOString(),
          monto: transaccion.monto || monto,
          comision: transaccion.comision || 0,
          montoTotal: transaccion.montoTotal || monto,
          descripcion: transaccion.descripcion || 'Transferencia vía Deuna',
          destinatario: nombreDestinatario,
          cuentaOrigen: `****${cuentaActual.numeroCuenta.slice(-4)}`,
        });
        setModalComprobante(true);
      }
    } catch (error: unknown) {
      console.error('Error en transferencia:', error);
      const axiosError = error as {
        response?: { data?: { msg?: string } };
      };
      setErrorDestino(axiosError.response?.data?.msg || 'Error al transferir');
    } finally {
      setLoading(false);
    }
  };

  const formatearMonto = (monto: number): string => {
    return monto.toLocaleString('es-EC', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIniciales = (nombre: string): string => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const renderTransaccion = (tx: Transaccion) => {
    let IconComponent: typeof PiggyBank;
    let tipo: string;
    let monto: number;
    let esPositivo: boolean;

    // Determinar si la transacción es a favor o en contra del cliente actual
    const esRecibida = tx.destinoId === cliente.id;

    switch (tx.tipoTransaccion) {
      case 'RECARGA':
        IconComponent = PiggyBank;
        tipo = 'recarga';
        monto = parseFloat(tx.monto.toString());
        esPositivo = true;
        break;
      case 'TRANSFERENCIA':
        if (esRecibida) {
          IconComponent = ArrowDownLeft;
          tipo = 'recibido';
          monto = parseFloat(tx.monto.toString());
          esPositivo = true;
        } else {
          IconComponent = ArrowUpRight;
          tipo = 'enviado';
          monto = parseFloat(tx.montoTotal.toString());
          esPositivo = false;
        }
        break;
      case 'RETIRO':
        IconComponent = ArrowUpRight;
        tipo = 'retiro';
        monto = parseFloat(tx.montoTotal.toString());
        esPositivo = false;
        break;
      case 'PAGO':
        IconComponent = FileText;
        tipo = 'pago';
        monto = parseFloat(tx.montoTotal.toString());
        esPositivo = false;
        break;
      default:
        IconComponent = FileText;
        tipo = '';
        monto = parseFloat(tx.monto.toString());
        esPositivo = true;
    }

    return (
      <div className="transaccion-item" key={tx.id}>
        <div className={`tx-avatar ${tipo}`}>
          <IconComponent size={20} />
        </div>
        <div className="tx-info">
          <div className="tx-nombre">{tx.descripcion || 'Sin descripción'}</div>
          <div className="tx-fecha">{formatearFecha(tx.createdAt)}</div>
        </div>
        <div className="tx-montos">
          <div className={`tx-monto ${esPositivo ? 'positivo' : 'negativo'}`}>
            {esPositivo ? '+' : '-'}${formatearMonto(monto)}
          </div>
          <div className={`tx-estado ${tx.estado.toLowerCase()}`}>
            {tx.estado}
          </div>
        </div>
      </div>
    );
  };

  const handleModalOverlayClick = (
    setter: (value: boolean) => void,
    resetFn?: () => void,
  ) => {
    return () => {
      setter(false);
      if (resetFn) resetFn();
    };
  };

  const handleModalContentClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="dashboard-layout">
      {/* ============ SIDEBAR DESKTOP ============ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/Banco-Pichincha.png" alt="Banco Pichincha" />
          </div>
          <div className="sidebar-title">
            Banco <br /> Pichincha
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menú principal</div>
            <button
              className={`sidebar-btn ${vistaActiva === 'inicio' ? 'active' : ''}`}
              onClick={() => setVistaActiva('inicio')}
            >
              <span className="icon">
                <Home size={20} />
              </span>
              <span>Inicio</span>
            </button>
            <button
              className={`sidebar-btn ${vistaActiva === 'mi-cuenta' ? 'active' : ''}`}
              onClick={() => setVistaActiva('mi-cuenta')}
            >
              <span className="icon">
                <Wallet size={20} />
              </span>
              <span>Mi Cuenta</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Operaciones</div>
            <button
              className="sidebar-btn"
              onClick={() => setModalDeposito(true)}
            >
              <span className="icon">
                <PiggyBank size={20} />
              </span>
              <span>Depositar</span>
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setModalTransferencia(true)}
            >
              <span className="icon">
                <Send size={20} />
              </span>
              <span>Transferir</span>
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setModalGenerarQR(true)}
            >
              <span className="icon">
                <QrCode size={20} />
              </span>
              <span>Generar QR</span>
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setModalPagarQR(true)}
            >
              <span className="icon">
                <Scan size={20} />
              </span>
              <span>Pagar QR</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Configuración</div>
            <button className="sidebar-btn">
              <span className="icon">
                <Settings size={20} />
              </span>
              <span>Ajustes</span>
            </button>
            <button className="sidebar-btn">
              <span className="icon">
                <Lock size={20} />
              </span>
              <span>Seguridad</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="avatar">{getIniciales(cliente.nombre)}</div>
            <div className="details">
              <div className="name">{cliente.nombre}</div>
              <div className="email">@{cliente.usuario}</div>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ============ DESKTOP VIEW ============ */}
      <main className="desktop-view">
        <header className="desktop-header">
          <div className="page-info">
            <h1 className="page-title">
              ¡Hola, {cliente.nombre.split(' ')[0]}!
            </h1>
            <p className="page-subtitle">Bienvenido a tu Banca Web</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-actualizar-desktop"
              onClick={actualizarSaldo}
            >
              <span>
                <RefreshCw size={16} />
              </span>
              <span>Actualizar</span>
            </button>
          </div>
        </header>

        <div className="desktop-content">
          <div className="desktop-grid">
            <div className="panel-principal">
              {vistaActiva === 'inicio' && (
                <>
                  {/* Tarjeta de saldo */}
                  <div className="saldo-card-desktop">
                    <div className="saldo-header">
                      <div>
                        <div className="label">Saldo total disponible</div>
                        <div className="monto">
                          ${formatearMonto(obtenerSaldoTotal())}
                        </div>
                      </div>
                    </div>
                    <div className="codigo-deuna">
                      <div className="codigo-row">
                        <div className="codigo-info-desktop">
                          <span className="codigo-label">
                            Tu código para recibir transferencias
                          </span>
                          <span className="codigo-valor-desktop">
                            {cliente.codigoDeuna}
                          </span>
                        </div>
                        <div className="codigo-actions">
                          <button
                            className="btn-codigo-desktop copiar"
                            onClick={copiarCodigo}
                          >
                            <span>
                              {codigoCopied ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </span>
                            <span>{codigoCopied ? 'Copiado' : 'Copiar'}</span>
                          </button>
                          <button
                            className="btn-codigo-desktop nuevo"
                            onClick={regenerarCodigo}
                          >
                            <span>
                              <RefreshCw size={16} />
                            </span>
                            <span>Nuevo código</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="acciones-desktop">
                    <div
                      className="accion-card"
                      onClick={() => setModalDeposito(true)}
                    >
                      <div className="icon">
                        <PiggyBank size={32} />
                      </div>
                      <div className="title">Depositar</div>
                      <div className="desc">Añade saldo a tu cuenta</div>
                    </div>
                    <div
                      className="accion-card"
                      onClick={() => setModalTransferencia(true)}
                    >
                      <div className="icon">
                        <Send size={32} />
                      </div>
                      <div className="title">Transferir</div>
                      <div className="desc">Envía dinero al instante</div>
                    </div>
                    <div
                      className="accion-card"
                      onClick={() => setModalGenerarQR(true)}
                    >
                      <div className="icon">
                        <QrCode size={32} />
                      </div>
                      <div className="title">Generar QR</div>
                      <div className="desc">Crea solicitud de cobro</div>
                    </div>
                    <div
                      className="accion-card"
                      onClick={() => setModalPagarQR(true)}
                    >
                      <div className="icon">
                        <Scan size={32} />
                      </div>
                      <div className="title">Pagar QR</div>
                      <div className="desc">Escanea y paga</div>
                    </div>
                  </div>

                  {/* Selector de cuenta */}
                  {cliente.cuentas && cliente.cuentas.length > 1 && (
                    <div className="selector-cuenta-desktop">
                      <h4>Seleccionar cuenta activa</h4>
                      <div className="cuentas-grid">
                        {cliente.cuentas.map((cuenta) => (
                          <div
                            key={cuenta.id}
                            className={`cuenta-item ${cuentaSeleccionada === cuenta.id ? 'activa' : ''}`}
                            onClick={() => setCuentaSeleccionada(cuenta.id)}
                          >
                            <div className="cuenta-tipo">
                              {cuenta.tipoCuenta}
                            </div>
                            <div className="cuenta-numero">
                              ****{cuenta.numeroCuenta.slice(-4)}
                            </div>
                            <div className="cuenta-saldo">
                              $
                              {formatearMonto(
                                parseFloat(cuenta.saldo.toString()),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensaje de éxito */}
                  {mensajeExito && (
                    <div className="mensaje-exito">
                      <Check size={20} />
                      <span>{mensajeExito}</span>
                      <button onClick={() => setMensajeExito('')}>
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Info usuario */}
                  <div className="info-usuario-desktop">
                    <h3>Información de tu cuenta</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="label">Nombre completo</div>
                        <div className="value">{cliente.nombre}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Usuario</div>
                        <div className="value">@{cliente.usuario}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Cédula</div>
                        <div className="value">{cliente.cedula}</div>
                      </div>
                      <div className="info-item">
                        <div className="label">Código de transferencia</div>
                        <div className="value">{cliente.codigoDeuna}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ============ VISTA MI CUENTA ============ */}
              {vistaActiva === 'mi-cuenta' && (
                <>
                  {/* Header Mi Cuenta */}
                  <div className="mi-cuenta-header">
                    <h2>
                      <Wallet size={24} /> Mi Cuenta
                    </h2>
                    <p>Administra tus cuentas, tarjetas y vinculaciones</p>
                  </div>

                  {/* Sección Cuentas Bancarias */}
                  <div className="mi-cuenta-seccion">
                    <div className="seccion-header">
                      <h3>
                        <Building size={20} /> Cuentas Bancarias
                      </h3>
                      <span className="badge">
                        {cliente.cuentas?.length || 0}
                      </span>
                    </div>
                    <div className="cuentas-lista">
                      {!cliente.cuentas || cliente.cuentas.length === 0 ? (
                        <div className="empty-state">
                          <Building size={40} />
                          <p>No tienes cuentas registradas</p>
                        </div>
                      ) : (
                        cliente.cuentas.map((cuenta) => (
                          <div key={cuenta.id} className="cuenta-card">
                            <div className="cuenta-icon">
                              <Building size={24} />
                            </div>
                            <div className="cuenta-info">
                              <div className="cuenta-tipo-badge">
                                {cuenta.tipoCuenta}
                              </div>
                              <div className="cuenta-numero-full">
                                {cuenta.numeroCuenta}
                              </div>
                              <div className="cuenta-detalles">
                                <span>Moneda: {cuenta.moneda}</span>
                                <span>
                                  Límite diario: $
                                  {formatearMonto(cuenta.limiteTransferencia)}
                                </span>
                              </div>
                            </div>
                            <div className="cuenta-saldo-grande">
                              <div className="saldo-label">
                                Saldo disponible
                              </div>
                              <div className="saldo-valor">
                                $
                                {formatearMonto(
                                  parseFloat(cuenta.saldo.toString()),
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sección Tarjetas */}
                  <div className="mi-cuenta-seccion">
                    <div className="seccion-header">
                      <h3>
                        <CreditCard size={20} /> Tarjetas
                      </h3>
                      <span className="badge">
                        {cliente.tarjetas?.length || 0}
                      </span>
                    </div>
                    <div className="tarjetas-lista">
                      {!cliente.tarjetas || cliente.tarjetas.length === 0 ? (
                        <div className="empty-state">
                          <CreditCard size={40} />
                          <p>No tienes tarjetas registradas</p>
                        </div>
                      ) : (
                        cliente.tarjetas.map((tarjeta) => (
                          <div
                            key={tarjeta.id}
                            className={`tarjeta-card ${tarjeta.tipoTarjeta.toLowerCase()}`}
                          >
                            <div className="tarjeta-header">
                              <span className="tarjeta-marca">
                                {tarjeta.marca}
                              </span>
                              <span
                                className={`tarjeta-tipo-badge ${tarjeta.tipoTarjeta.toLowerCase()}`}
                              >
                                {tarjeta.tipoTarjeta}
                              </span>
                            </div>
                            <div className="tarjeta-numero">
                              **** **** **** {tarjeta.numeroTarjeta.slice(-4)}
                            </div>
                            <div className="tarjeta-footer">
                              <div className="tarjeta-expira">
                                <span className="label">Expira</span>
                                <span className="value">
                                  {tarjeta.fechaExpiracion}
                                </span>
                              </div>
                              {tarjeta.tipoTarjeta === 'CREDITO' &&
                                tarjeta.limiteCredito && (
                                  <div className="tarjeta-limite">
                                    <span className="label">Límite</span>
                                    <span className="value">
                                      ${formatearMonto(tarjeta.limiteCredito)}
                                    </span>
                                  </div>
                                )}
                              {tarjeta.tipoTarjeta === 'CREDITO' &&
                                tarjeta.saldoDisponible !== undefined && (
                                  <div className="tarjeta-disponible">
                                    <span className="label">Disponible</span>
                                    <span className="value">
                                      ${formatearMonto(tarjeta.saldoDisponible)}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sección Vinculaciones Deuna */}
                  <div className="mi-cuenta-seccion">
                    <div className="seccion-header">
                      <h3>
                        <Link2 size={20} /> Vinculaciones Deuna
                      </h3>
                      <span className="badge">
                        {cliente.vinculacionesDeuna?.length || 0}
                      </span>
                    </div>
                    <div className="vinculaciones-lista">
                      {!cliente.vinculacionesDeuna ||
                      cliente.vinculacionesDeuna.length === 0 ? (
                        <div className="empty-state">
                          <Link2 size={40} />
                          <p>No tienes vinculaciones Deuna</p>
                        </div>
                      ) : (
                        cliente.vinculacionesDeuna.map((vinculacion) => (
                          <div
                            key={vinculacion.id}
                            className={`vinculacion-card ${vinculacion.esPrincipal ? 'principal' : ''}`}
                          >
                            <div className="vinculacion-icon">
                              <Link2 size={24} />
                            </div>
                            <div className="vinculacion-info">
                              {vinculacion.esPrincipal && (
                                <span className="vinculacion-principal-badge">
                                  Principal
                                </span>
                              )}
                              <div className="vinculacion-alias">
                                {vinculacion.alias
                                  ? `@${vinculacion.alias}`
                                  : 'Sin alias'}
                              </div>
                              <div className="vinculacion-detalles">
                                {vinculacion.token && (
                                  <span>Token: {vinculacion.token}</span>
                                )}
                                {vinculacion.numeroIdentificacion && (
                                  <span>
                                    ID: {vinculacion.numeroIdentificacion}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="vinculacion-estado">
                              <span
                                className={`estado-badge ${vinculacion.activo ? 'activo' : 'inactivo'}`}
                              >
                                {vinculacion.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Panel lateral - Movimientos */}
            <div className="panel-lateral">
              <div className="section-header">
                <h3 className="section-title">Últimos movimientos</h3>
                <button className="btn-refresh" onClick={cargarTransacciones}>
                  <RefreshCw size={18} />
                </button>
              </div>
              <div className="transacciones-lista">
                {transacciones.length === 0 ? (
                  <div className="sin-transacciones">
                    <span className="icon">
                      <Inbox size={40} />
                    </span>
                    <p>Sin movimientos aún</p>
                  </div>
                ) : (
                  transacciones.slice(0, 8).map((tx) => renderTransaccion(tx))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============ MOBILE VIEW ============ */}
      <div className="mobile-view">
        <header className="mobile-header">
          <div className="header-left">
            <div className="logo">
              <img src="/Banco-Pichincha.png" alt="Banco Pichincha" />
            </div>
            <h1>Banco Pichincha</h1>
          </div>
          <div className="header-right">
            <div className="user-avatar">{getIniciales(cliente.nombre)}</div>
            <button className="btn-logout" onClick={onLogout}>
              Salir
            </button>
          </div>
        </header>

        <div className="saludo-section">
          <div className="saludo-text">¡Hola!</div>
          <div className="saludo-nombre">{cliente.nombre.split(' ')[0]}</div>
        </div>

        <div className="saldo-card">
          <div className="saldo-label">Saldo total disponible</div>
          <div className="saldo-row">
            <div className="saldo-monto">
              <span className="currency">$</span>
              {formatearMonto(obtenerSaldoTotal())}
            </div>
            <button className="btn-actualizar" onClick={actualizarSaldo}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="acciones-rapidas">
          <button className="accion-btn" onClick={() => setModalDeposito(true)}>
            <div className="accion-icon">
              <PiggyBank size={20} />
            </div>
            <span className="accion-label">Depositar</span>
          </button>
          <button
            className="accion-btn"
            onClick={() => setModalTransferencia(true)}
          >
            <div className="accion-icon">
              <Send size={20} />
            </div>
            <span className="accion-label">Transferir</span>
          </button>
          <button className="accion-btn">
            <div className="accion-icon">
              <BarChart3 size={20} />
            </div>
            <span className="accion-label">Historial</span>
          </button>
          <button className="accion-btn">
            <div className="accion-icon">
              <User size={20} />
            </div>
            <span className="accion-label">Perfil</span>
          </button>
        </div>

        <div className="codigo-section">
          <div className="section-header">
            <h3 className="section-title">Tu código de transferencia</h3>
          </div>
          <div className="codigo-display">
            <div className="codigo-valor">{cliente.codigoDeuna}</div>
            <div className="codigo-botones">
              <button className="btn-codigo btn-copiar" onClick={copiarCodigo}>
                <span>
                  {codigoCopied ? <Check size={14} /> : <Copy size={14} />}
                </span>
                <span>{codigoCopied ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                className="btn-codigo btn-regenerar"
                onClick={regenerarCodigo}
              >
                <span>
                  <RefreshCw size={14} />
                </span>
                <span>Nuevo</span>
              </button>
            </div>
            <div className="codigo-info">
              Comparte este código para recibir dinero
            </div>
          </div>
        </div>

        <div className="movimientos-section">
          <div className="section-header">
            <h3 className="section-title">Últimos movimientos</h3>
          </div>
          <div className="transacciones-lista">
            {transacciones.length === 0 ? (
              <div className="sin-transacciones">
                <span className="icon">
                  <Inbox size={40} />
                </span>
                <p>Sin movimientos aún</p>
              </div>
            ) : (
              transacciones.slice(0, 5).map((tx) => renderTransaccion(tx))
            )}
          </div>
        </div>

        <nav className="bottom-nav">
          <button className="nav-item active">
            <span className="nav-icon">
              <Home size={18} />
            </span>
            <span className="nav-label">Inicio</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">
              <BarChart3 size={18} />
            </span>
            <span className="nav-label">Historial</span>
          </button>
          <button
            className="nav-item center-btn"
            onClick={() => setModalTransferencia(true)}
          >
            <span className="nav-icon">
              <Send size={18} />
            </span>
            <span className="nav-label">Enviar</span>
          </button>
          <button className="nav-item" onClick={() => setModalDeposito(true)}>
            <span className="nav-icon">
              <PiggyBank size={18} />
            </span>
            <span className="nav-label">Depositar</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">
              <User size={18} />
            </span>
            <span className="nav-label">Perfil</span>
          </button>
        </nav>
      </div>

      {/* ============ MODAL DEPOSITO ============ */}
      {modalDeposito && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick(setModalDeposito)}
        >
          <div className="modal-content" onClick={handleModalContentClick}>
            <div className="modal-header">
              <h3>
                <PiggyBank
                  size={20}
                  style={{ display: 'inline', marginRight: 8 }}
                />{' '}
                Depositar
              </h3>
              <button
                className="btn-cerrar"
                onClick={() => setModalDeposito(false)}
              >
                <X size={14} />
              </button>
            </div>
            <form className="operacion-form" onSubmit={realizarDeposito}>
              <div className="form-group">
                <label>Monto a depositar</label>
                <input
                  type="number"
                  className="input-monto"
                  placeholder="0.00"
                  value={montoDeposito}
                  onChange={(e) => setMontoDeposito(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-operacion btn-depositar"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Depositar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL TRANSFERENCIA ============ */}
      {modalTransferencia && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick(setModalTransferencia, () => {
            setDestinatario(null);
            setCodigoDestino('');
            setErrorDestino('');
          })}
        >
          <div className="modal-content" onClick={handleModalContentClick}>
            <div className="modal-header">
              <h3>
                <Send size={20} style={{ display: 'inline', marginRight: 8 }} />{' '}
                Transferir
              </h3>
              <button
                className="btn-cerrar"
                onClick={() => {
                  setModalTransferencia(false);
                  setDestinatario(null);
                  setCodigoDestino('');
                  setErrorDestino('');
                }}
              >
                <X size={14} />
              </button>
            </div>
            <form className="operacion-form" onSubmit={realizarTransferencia}>
              <div className="form-group">
                <label>Código del destinatario</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    placeholder="Ej: A1B2C3D4"
                    value={codigoDestino}
                    onChange={(e) => {
                      setCodigoDestino(e.target.value.toUpperCase());
                      setDestinatario(null);
                      setErrorDestino('');
                    }}
                    maxLength={8}
                  />
                  <button
                    type="button"
                    className="btn-buscar"
                    onClick={buscarDestinatario}
                    disabled={codigoDestino.length !== 8 || loading}
                  >
                    Buscar
                  </button>
                </div>
                {destinatario && (
                  <div className="destinatario-info">
                    <div className="avatar">
                      {getIniciales(destinatario.nombre)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {destinatario.nombre}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        @{destinatario.usuario}
                      </div>
                    </div>
                  </div>
                )}
                {errorDestino && (
                  <div className="destinatario-error">{errorDestino}</div>
                )}
              </div>

              {destinatario && (
                <div className="form-group">
                  <label>
                    Monto a transferir
                    <span className="saldo-disponible">
                      Disponible: $
                      {formatearMonto(obtenerCuentaActual()?.saldo || 0)}
                    </span>
                  </label>
                  <input
                    type="number"
                    className={`input-monto ${errorMonto ? 'input-error' : ''}`}
                    placeholder="0.00"
                    value={montoTransferencia}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setMontoTransferencia(valor);
                      const monto = parseFloat(valor);
                      const saldoDisponible = obtenerCuentaActual()?.saldo || 0;
                      if (!isNaN(monto) && monto > saldoDisponible) {
                        setErrorMonto('Saldo insuficiente');
                      } else if (!isNaN(monto) && monto <= 0) {
                        setErrorMonto('El monto debe ser mayor a 0');
                      } else {
                        setErrorMonto('');
                      }
                    }}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  {errorMonto && (
                    <div className="error-monto">{errorMonto}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn-operacion btn-transferir"
                disabled={
                  !destinatario ||
                  loading ||
                  !montoTransferencia ||
                  !!errorMonto
                }
              >
                {loading ? 'Procesando...' : 'Transferir'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL GENERAR QR ============ */}
      {modalGenerarQR && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick(setModalGenerarQR, () => {
            setMontoQR('');
            setDescripcionQR('');
            setCodigoQRGenerado('');
            setErrorMonto('');
          })}
        >
          <div className="modal-content" onClick={handleModalContentClick}>
            <div className="modal-header">
              <h3>
                <QrCode
                  size={20}
                  style={{ display: 'inline', marginRight: 8 }}
                />
                {codigoQRGenerado
                  ? 'Solicitud Generada'
                  : 'Generar Solicitud de Cobro'}
              </h3>
              <button
                className="btn-cerrar"
                onClick={() => {
                  setModalGenerarQR(false);
                  setMontoQR('');
                  setDescripcionQR('');
                  setCodigoQRGenerado('');
                  setErrorMonto('');
                }}
              >
                <X size={14} />
              </button>
            </div>

            {!codigoQRGenerado ? (
              <form className="operacion-form" onSubmit={generarQR}>
                <div className="form-group">
                  <label>Monto a cobrar</label>
                  <input
                    type="number"
                    className="input-monto"
                    placeholder="0.00"
                    value={montoQR}
                    onChange={(e) => setMontoQR(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Pago por producto/servicio"
                    value={descripcionQR}
                    onChange={(e) => setDescripcionQR(e.target.value)}
                  />
                </div>
                {errorMonto && <div className="error-monto">{errorMonto}</div>}
                <button
                  type="submit"
                  className="btn-operacion btn-qr"
                  disabled={loading}
                >
                  {loading ? 'Generando...' : 'Generar QR'}
                </button>
              </form>
            ) : (
              <div className="qr-resultado">
                <div className="qr-info">
                  <p>Comparte este código con quien te pagará:</p>
                  <div className="qr-code-display">
                    <code>{codigoQRGenerado.substring(0, 40)}...</code>
                  </div>
                  <button
                    className="btn-codigo-desktop copiar"
                    onClick={copiarQR}
                    style={{ marginTop: '1rem' }}
                  >
                    <span>
                      {qrCopied ? <Check size={16} /> : <Copy size={16} />}
                    </span>
                    <span>
                      {qrCopied ? 'Copiado' : 'Copiar código completo'}
                    </span>
                  </button>
                  <p className="qr-nota">Este código expira en 30 minutos</p>
                </div>
                <button
                  className="btn-operacion btn-nuevo-qr"
                  onClick={() => {
                    setCodigoQRGenerado('');
                    setMontoQR('');
                    setDescripcionQR('');
                  }}
                >
                  Generar otro QR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ MODAL PAGAR QR ============ */}
      {modalPagarQR && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick(setModalPagarQR, () => {
            setCodigoQRPagar('');
            setErrorDestino('');
          })}
        >
          <div className="modal-content" onClick={handleModalContentClick}>
            <div className="modal-header">
              <h3>
                <Scan size={20} style={{ display: 'inline', marginRight: 8 }} />
                Pagar con QR
              </h3>
              <button
                className="btn-cerrar"
                onClick={() => {
                  setModalPagarQR(false);
                  setCodigoQRPagar('');
                  setErrorDestino('');
                }}
              >
                <X size={14} />
              </button>
            </div>
            <form className="operacion-form" onSubmit={procesarPagoQR}>
              <div className="form-group">
                <label>Pega el código QR recibido</label>
                <textarea
                  className="input-qr"
                  placeholder="Pega aquí el código QR..."
                  value={codigoQRPagar}
                  onChange={(e) => {
                    setCodigoQRPagar(e.target.value);
                    setErrorDestino('');
                  }}
                  rows={4}
                  required
                />
                {errorDestino && (
                  <div className="destinatario-error">{errorDestino}</div>
                )}
              </div>
              <div className="form-group">
                <label>
                  Cuenta a debitar
                  <span className="saldo-disponible">
                    Disponible: $
                    {formatearMonto(obtenerCuentaActual()?.saldo || 0)}
                  </span>
                </label>
                {cliente.cuentas && cliente.cuentas.length > 1 && (
                  <select
                    className="select-cuenta"
                    value={cuentaSeleccionada || ''}
                    onChange={(e) =>
                      setCuentaSeleccionada(Number(e.target.value))
                    }
                  >
                    {cliente.cuentas.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        {cuenta.tipoCuenta} - ****
                        {cuenta.numeroCuenta.slice(-4)} - $
                        {formatearMonto(parseFloat(cuenta.saldo.toString()))}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                type="submit"
                className="btn-operacion btn-pagar-qr"
                disabled={loading || !codigoQRPagar.trim()}
              >
                {loading ? 'Procesando...' : 'Pagar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL COMPROBANTE ============ */}
      {modalComprobante && comprobanteData && (
        <div
          className="modal-overlay"
          onClick={() => {
            setModalComprobante(false);
            setComprobanteData(null);
          }}
        >
          <div
            className="modal-content comprobante-modal"
            onClick={handleModalContentClick}
          >
            <div className="comprobante-header">
              <div className="comprobante-icon-wrapper">
                <Check size={40} />
              </div>
              <h2>¡Transacción Exitosa!</h2>
              <p className="comprobante-tipo">
                {comprobanteData.tipo === 'RECARGA' && 'Recarga de saldo'}
                {comprobanteData.tipo === 'TRANSFERENCIA' &&
                  'Transferencia enviada'}
                {comprobanteData.tipo === 'PAGO_QR' && 'Pago con QR'}
              </p>
            </div>

            <div className="comprobante-monto-principal">
              <span className="label">Monto total debitado</span>
              <span className="monto">
                ${formatearMonto(comprobanteData.montoTotal)}
              </span>
            </div>

            <div className="comprobante-detalles">
              <div className="comprobante-row">
                <span className="label">Referencia</span>
                <span className="value codigo">
                  {comprobanteData.referencia}
                </span>
              </div>
              <div className="comprobante-row">
                <span className="label">Fecha y hora</span>
                <span className="value">
                  {formatearFecha(comprobanteData.fecha)}
                </span>
              </div>
              <div className="comprobante-divider"></div>
              <div className="comprobante-row">
                <span className="label">Monto</span>
                <span className="value">
                  ${formatearMonto(comprobanteData.monto)}
                </span>
              </div>
              <div className="comprobante-row">
                <span className="label">Comisión</span>
                <span className="value comision">
                  ${formatearMonto(comprobanteData.comision)}
                </span>
              </div>
              <div className="comprobante-row total">
                <span className="label">Total</span>
                <span className="value">
                  ${formatearMonto(comprobanteData.montoTotal)}
                </span>
              </div>
              <div className="comprobante-divider"></div>
              {comprobanteData.destinatario && (
                <div className="comprobante-row">
                  <span className="label">Beneficiario</span>
                  <span className="value">{comprobanteData.destinatario}</span>
                </div>
              )}
              {comprobanteData.cuentaOrigen && (
                <div className="comprobante-row">
                  <span className="label">Cuenta origen</span>
                  <span className="value">{comprobanteData.cuentaOrigen}</span>
                </div>
              )}
              {comprobanteData.cuentaDestino && (
                <div className="comprobante-row">
                  <span className="label">Cuenta destino</span>
                  <span className="value">{comprobanteData.cuentaDestino}</span>
                </div>
              )}
              <div className="comprobante-row">
                <span className="label">Descripción</span>
                <span className="value">{comprobanteData.descripcion}</span>
              </div>
            </div>

            <div className="comprobante-acciones">
              <button
                className="btn-comprobante btn-cerrar-comprobante"
                onClick={() => {
                  setModalComprobante(false);
                  setComprobanteData(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
