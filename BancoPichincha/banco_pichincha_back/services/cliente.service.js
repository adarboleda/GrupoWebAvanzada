import {
  Cliente,
  Cuenta,
  Tarjeta,
  Transaccion,
  VinculacionDeuna,
} from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

class ClienteService {
  // Login de cliente - regenera código DEUNA automáticamente
  async login(usuario, password) {
    const cliente = await Cliente.findOne({
      where: { usuario: usuario.toLowerCase(), activo: true },
    });

    if (!cliente) {
      throw new Error('Usuario no encontrado');
    }

    if (!cliente.verificarPassword(password)) {
      throw new Error('Contraseña incorrecta');
    }

    // Regenerar código DEUNA en cada login
    await cliente.regenerarCodigo();

    // Retornar cliente con todos los datos incluídos
    return await this.obtenerClientePorId(cliente.id);
  }

  // Crear nuevo cliente con cuenta inicial
  async crearCliente(datosCliente) {
    const t = await sequelize.transaction();

    try {
      // Crear cliente
      const cliente = await Cliente.create(
        {
          ...datosCliente,
          usuario: datosCliente.usuario.toLowerCase(),
        },
        { transaction: t },
      );

      // Crear cuenta de ahorros inicial
      const numeroCuenta = this.generarNumeroCuenta();
      const cuenta = await Cuenta.create(
        {
          clienteId: cliente.id,
          numeroCuenta,
          tipoCuenta: 'AHORROS',
          saldo: 0,
          moneda: 'USD',
          activo: true,
          limiteTransferencia: 5000.0,
        },
        { transaction: t },
      );

      // Crear vinculación Deuna principal
      await VinculacionDeuna.create(
        {
          clienteId: cliente.id,
          cuentaId: cuenta.id,
          alias: datosCliente.usuario.toLowerCase(),
          numeroIdentificacion: cliente.cedula,
          token: cliente.codigoDeuna,
          activo: true,
          esPrincipal: true,
        },
        { transaction: t },
      );

      await t.commit();

      // Recargar cliente con relaciones
      return await Cliente.findByPk(cliente.id, {
        include: [
          {
            model: Cuenta,
            as: 'cuentas',
            include: [
              {
                model: VinculacionDeuna,
                as: 'vinculacionesDeuna',
              },
            ],
          },
        ],
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Obtener todos los clientes
  async obtenerClientes() {
    return await Cliente.findAll({
      where: { activo: true },
      include: [
        {
          model: Cuenta,
          as: 'cuentas',
          where: { activo: true },
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Obtener cliente por ID
  async obtenerClientePorId(id) {
    return await Cliente.findByPk(id, {
      include: [
        {
          model: Cuenta,
          as: 'cuentas',
          where: { activo: true },
          required: false,
          include: [
            {
              model: Tarjeta,
              as: 'tarjetas',
              where: { activo: true },
              required: false,
            },
            {
              model: VinculacionDeuna,
              as: 'vinculacionesDeuna',
              where: { activo: true },
              required: false,
            },
          ],
        },
        {
          model: Tarjeta,
          as: 'tarjetas',
          where: { activo: true },
          required: false,
        },
        {
          model: VinculacionDeuna,
          as: 'vinculacionesDeuna',
          where: { activo: true },
          required: false,
        },
      ],
    });
  }

  // Obtener cliente por código DEUNA
  async obtenerClientePorCodigo(codigoDeuna) {
    return await Cliente.findOne({
      where: { codigoDeuna: codigoDeuna.toUpperCase(), activo: true },
      include: [
        {
          model: Cuenta,
          as: 'cuentas',
          where: { activo: true },
          required: false,
        },
      ],
    });
  }

  // Actualizar cliente
  async actualizarCliente(id, datosCliente) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    await cliente.update(datosCliente);
    return await this.obtenerClientePorId(id);
  }

  // Eliminar cliente (soft delete)
  async eliminarCliente(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    await cliente.update({ activo: false });
    return cliente;
  }

  // SERVICIO RECARGA - Recargar saldo a cuenta
  async recargaSaldo(
    clienteId,
    cuentaId,
    monto,
    descripcion = 'Recarga de saldo vía Deuna',
  ) {
    const t = await sequelize.transaction();

    try {
      // Validar monto
      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Obtener cliente
      const cliente = await Cliente.findByPk(clienteId, { transaction: t });
      if (!cliente || !cliente.activo) {
        throw new Error('Cliente no encontrado o inactivo');
      }

      // Obtener cuenta
      const cuenta = await Cuenta.findByPk(cuentaId, { transaction: t });
      if (!cuenta || !cuenta.activo || cuenta.clienteId !== clienteId) {
        throw new Error('Cuenta no encontrada o no pertenece al cliente');
      }

      // Calcular comisión (0.5% por recarga)
      const comision = parseFloat((monto * 0.005).toFixed(2));
      const montoTotal = parseFloat((parseFloat(monto) + comision).toFixed(2));

      // Actualizar saldo de la cuenta
      const nuevoSaldo = parseFloat(cuenta.saldo) + parseFloat(monto);
      await cuenta.update({ saldo: nuevoSaldo }, { transaction: t });

      // Generar referencia única
      const referencia = this.generarReferencia('REC');

      // Registrar transacción
      const transaccion = await Transaccion.create(
        {
          tipoTransaccion: 'RECARGA',
          origenId: clienteId,
          cuentaDestinoId: cuenta.id,
          monto: parseFloat(monto),
          comision,
          montoTotal,
          estado: 'CONFIRMADA',
          descripcion,
          referencia,
          ipOrigen: null,
          navegador: null,
        },
        { transaction: t },
      );

      await t.commit();

      return {
        exito: true,
        cliente,
        cuenta,
        transaccion,
        mensaje: `Recarga exitosa de $${monto}. Comisión: $${comision}`,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // SERVICIO TRANSFERIR - Transferencia inmediata vía Deuna
  async transferirDeuna(datosTransferencia) {
    const {
      clienteOrigenId,
      codigoDestino,
      cuentaOrigenId,
      monto,
      descripcion = '',
    } = datosTransferencia;
    const t = await sequelize.transaction();

    try {
      // Validar monto
      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Obtener cliente origen
      const clienteOrigen = await Cliente.findByPk(clienteOrigenId, {
        transaction: t,
      });
      if (!clienteOrigen || !clienteOrigen.activo) {
        throw new Error('Cliente origen no encontrado');
      }

      // Obtener cuenta origen
      const cuentaOrigen = await Cuenta.findByPk(cuentaOrigenId, {
        transaction: t,
      });
      if (
        !cuentaOrigen ||
        !cuentaOrigen.activo ||
        cuentaOrigen.clienteId !== clienteOrigenId
      ) {
        throw new Error('Cuenta origen no válida');
      }

      // Verificar saldo suficiente
      const montoNumerico = parseFloat(monto);
      const saldoCuenta = parseFloat(cuentaOrigen.saldo);

      // Calcular comisión (1% por transferencia)
      const comision = parseFloat((montoNumerico * 0.01).toFixed(2));
      const montoTotal = parseFloat((montoNumerico + comision).toFixed(2));

      if (saldoCuenta < montoTotal) {
        throw new Error(
          `Saldo insuficiente. Necesitas $${montoTotal} (incluye comisión de $${comision})`,
        );
      }

      // Verificar límite de transferencia
      if (montoNumerico > parseFloat(cuentaOrigen.limiteTransferencia)) {
        throw new Error(
          `El monto excede el límite diario de transferencia ($${cuentaOrigen.limiteTransferencia})`,
        );
      }

      // Buscar cliente destino por código DEUNA
      const clienteDestino = await Cliente.findOne({
        where: { codigoDeuna: codigoDestino.toUpperCase(), activo: true },
        transaction: t,
      });

      if (!clienteDestino) {
        throw new Error('Código DEUNA no válido o no encontrado');
      }

      // Verificar que no sea el mismo cliente
      if (clienteOrigen.id === clienteDestino.id) {
        throw new Error('No puedes transferir a tu propia cuenta');
      }

      // Obtener cuenta destino principal (primera cuenta activa)
      const cuentaDestino = await Cuenta.findOne({
        where: { clienteId: clienteDestino.id, activo: true },
        order: [['id', 'ASC']],
        transaction: t,
      });

      if (!cuentaDestino) {
        throw new Error('El destinatario no tiene cuentas activas');
      }

      // Realizar la transferencia
      const nuevoSaldoOrigen = parseFloat(cuentaOrigen.saldo) - montoTotal;
      const nuevoSaldoDestino = parseFloat(cuentaDestino.saldo) + montoNumerico;

      await cuentaOrigen.update(
        { saldo: nuevoSaldoOrigen },
        { transaction: t },
      );
      await cuentaDestino.update(
        { saldo: nuevoSaldoDestino },
        { transaction: t },
      );

      // Generar referencia única
      const referencia = this.generarReferencia('TRF');

      // Registrar transacción
      const transaccion = await Transaccion.create(
        {
          tipoTransaccion: 'TRANSFERENCIA',
          origenId: clienteOrigen.id,
          destinoId: clienteDestino.id,
          cuentaOrigenId: cuentaOrigen.id,
          cuentaDestinoId: cuentaDestino.id,
          monto: montoNumerico,
          comision,
          montoTotal,
          estado: 'CONFIRMADA',
          descripcion:
            descripcion || `Transferencia a ${clienteDestino.nombre}`,
          referencia,
          ipOrigen: null,
          navegador: null,
        },
        { transaction: t },
      );

      await t.commit();

      return {
        exito: true,
        clienteOrigen,
        clienteDestino,
        cuentaOrigen,
        cuentaDestino,
        transaccion,
        mensaje: `Transferencia exitosa de $${monto} a ${clienteDestino.nombre}. Comisión: $${comision}`,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Obtener historial de transacciones de un cliente
  async obtenerTransacciones(clienteId, limite = 50) {
    return await Transaccion.findAll({
      where: {
        [Op.or]: [{ origenId: clienteId }, { destinoId: clienteId }],
      },
      include: [
        {
          model: Cliente,
          as: 'clienteOrigen',
          attributes: ['id', 'nombre', 'codigoDeuna'],
        },
        {
          model: Cliente,
          as: 'clienteDestino',
          attributes: ['id', 'nombre', 'codigoDeuna'],
        },
        {
          model: Cuenta,
          as: 'cuentaOrigen',
          attributes: ['id', 'numeroCuenta', 'tipoCuenta'],
        },
        {
          model: Cuenta,
          as: 'cuentaDestino',
          attributes: ['id', 'numeroCuenta', 'tipoCuenta'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: limite,
    });
  }

  // Regenerar código DEUNA
  async regenerarCodigo(clienteId) {
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    await cliente.regenerarCodigo();

    // Devolver cliente con cuentas incluidas para mantener el saldo en el frontend
    return await Cliente.findByPk(clienteId, {
      include: [
        {
          model: Cuenta,
          as: 'cuentas',
          where: { activo: true },
          required: false,
        },
      ],
    });
  }

  // Obtener estadísticas generales
  async obtenerEstadisticas() {
    const totalClientes = await Cliente.count({ where: { activo: true } });

    const saldoResult = await Cuenta.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('saldo')), 'total']],
      where: { activo: true },
      raw: true,
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const transaccionesHoy = await Transaccion.count({
      where: {
        createdAt: { [Op.gte]: hoy },
      },
    });

    const totalTransacciones = await Transaccion.count();

    return {
      totalClientes,
      saldoTotal: parseFloat(saldoResult[0]?.total || 0),
      transaccionesHoy,
      totalTransacciones,
    };
  }

  // SERVICIO GENERAR SOLICITUD DE COBRO (QR)
  async generarSolicitudCobro(datosCobroQR) {
    const {
      clienteId,
      cuentaId,
      monto,
      descripcion = '',
      minutosExpiracion = 30,
    } = datosCobroQR;
    const t = await sequelize.transaction();

    try {
      // Validar monto
      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Obtener cliente
      const cliente = await Cliente.findByPk(clienteId, { transaction: t });
      if (!cliente || !cliente.activo) {
        throw new Error('Cliente no encontrado');
      }

      // Obtener cuenta
      const cuenta = await Cuenta.findByPk(cuentaId, { transaction: t });
      if (!cuenta || !cuenta.activo || cuenta.clienteId !== clienteId) {
        throw new Error('Cuenta no válida');
      }

      // Generar referencia única para el QR
      const referencia = this.generarReferencia('QR');

      // Generar código QR (datos JSON codificados en base64)
      const datosQR = {
        ref: referencia,
        monto: monto,
        destino: cliente.codigoDeuna,
        cuentaId: cuenta.id,
        desc: descripcion,
      };
      const codigoQR = Buffer.from(JSON.stringify(datosQR)).toString('base64');

      // Calcular fecha de expiración
      const fechaExpiracion = new Date();
      fechaExpiracion.setMinutes(
        fechaExpiracion.getMinutes() + minutosExpiracion,
      );

      // Crear transacción pendiente
      const transaccion = await Transaccion.create(
        {
          tipoTransaccion: 'PAGO',
          destinoId: clienteId,
          cuentaDestinoId: cuenta.id,
          monto: parseFloat(monto),
          comision: 0,
          montoTotal: parseFloat(monto),
          estado: 'PENDIENTE',
          descripcion: descripcion || 'Solicitud de cobro QR',
          referencia,
          codigoQR,
          fechaExpiracion,
          ipOrigen: null,
          navegador: null,
        },
        { transaction: t },
      );

      await t.commit();

      return {
        exito: true,
        transaccion,
        codigoQR,
        referencia,
        fechaExpiracion,
        mensaje: `Solicitud de cobro creada. Expira en ${minutosExpiracion} minutos.`,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // SERVICIO PAGAR SOLICITUD DE COBRO (QR)
  async pagarSolicitudCobro(datosPago) {
    const {
      clienteOrigenId,
      cuentaOrigenId,
      codigoQR,
      ipOrigen = null,
      navegador = null,
    } = datosPago;
    const t = await sequelize.transaction();

    try {
      // Decodificar QR
      let datosQR;
      try {
        datosQR = JSON.parse(Buffer.from(codigoQR, 'base64').toString('utf8'));
      } catch {
        throw new Error('Código QR inválido');
      }

      // Buscar transacción por referencia
      const transaccionPendiente = await Transaccion.findOne({
        where: { referencia: datosQR.ref, estado: 'PENDIENTE' },
        transaction: t,
      });

      if (!transaccionPendiente) {
        throw new Error('Solicitud de cobro no encontrada o ya procesada');
      }

      // Verificar expiración
      if (new Date() > new Date(transaccionPendiente.fechaExpiracion)) {
        await transaccionPendiente.update(
          { estado: 'FALLIDA' },
          { transaction: t },
        );
        await t.commit();
        throw new Error('La solicitud de cobro ha expirado');
      }

      // Obtener cliente origen
      const clienteOrigen = await Cliente.findByPk(clienteOrigenId, {
        transaction: t,
      });
      if (!clienteOrigen || !clienteOrigen.activo) {
        throw new Error('Cliente pagador no encontrado');
      }

      // Verificar que no sea el mismo cliente
      if (clienteOrigen.id === transaccionPendiente.destinoId) {
        throw new Error('No puedes pagar tu propia solicitud de cobro');
      }

      // Obtener cuenta origen
      const cuentaOrigen = await Cuenta.findByPk(cuentaOrigenId, {
        transaction: t,
      });
      if (
        !cuentaOrigen ||
        !cuentaOrigen.activo ||
        cuentaOrigen.clienteId !== clienteOrigenId
      ) {
        throw new Error('Cuenta origen no válida');
      }

      // Calcular comisión (0.5% por pago QR)
      const monto = parseFloat(transaccionPendiente.monto);
      const comision = parseFloat((monto * 0.005).toFixed(2));
      const montoTotal = parseFloat((monto + comision).toFixed(2));

      // Verificar saldo
      if (parseFloat(cuentaOrigen.saldo) < montoTotal) {
        throw new Error(`Saldo insuficiente. Necesitas $${montoTotal}`);
      }

      // Obtener cuenta destino
      const cuentaDestino = await Cuenta.findByPk(
        transaccionPendiente.cuentaDestinoId,
        { transaction: t },
      );
      if (!cuentaDestino) {
        throw new Error('Cuenta destino no encontrada');
      }

      // Realizar el pago
      const nuevoSaldoOrigen = parseFloat(cuentaOrigen.saldo) - montoTotal;
      const nuevoSaldoDestino = parseFloat(cuentaDestino.saldo) + monto;

      await cuentaOrigen.update(
        { saldo: nuevoSaldoOrigen },
        { transaction: t },
      );
      await cuentaDestino.update(
        { saldo: nuevoSaldoDestino },
        { transaction: t },
      );

      // Actualizar transacción
      await transaccionPendiente.update(
        {
          origenId: clienteOrigen.id,
          cuentaOrigenId: cuentaOrigen.id,
          comision,
          montoTotal,
          estado: 'CONFIRMADA',
          ipOrigen,
          navegador,
        },
        { transaction: t },
      );

      await t.commit();

      const clienteDestino = await Cliente.findByPk(
        transaccionPendiente.destinoId,
      );

      return {
        exito: true,
        transaccion: transaccionPendiente,
        clienteOrigen,
        clienteDestino,
        mensaje: `Pago de $${monto} realizado exitosamente a ${clienteDestino?.nombre}`,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // SERVICIO REVERSAR TRANSACCIÓN
  async reversarTransaccion(transaccionId, motivo = 'Reversión solicitada') {
    const t = await sequelize.transaction();

    try {
      // Obtener transacción
      const transaccion = await Transaccion.findByPk(transaccionId, {
        transaction: t,
      });
      if (!transaccion) {
        throw new Error('Transacción no encontrada');
      }

      if (transaccion.estado !== 'CONFIRMADA') {
        throw new Error('Solo se pueden reversar transacciones confirmadas');
      }

      // Verificar que no sea muy antigua (máximo 24 horas)
      const horasTranscurridas =
        (Date.now() - new Date(transaccion.createdAt).getTime()) /
        (1000 * 60 * 60);
      if (horasTranscurridas > 24) {
        throw new Error(
          'Solo se pueden reversar transacciones de las últimas 24 horas',
        );
      }

      // Obtener cuentas involucradas
      const cuentaOrigen = transaccion.cuentaOrigenId
        ? await Cuenta.findByPk(transaccion.cuentaOrigenId, { transaction: t })
        : null;
      const cuentaDestino = transaccion.cuentaDestinoId
        ? await Cuenta.findByPk(transaccion.cuentaDestinoId, { transaction: t })
        : null;

      // Revertir los movimientos según tipo de transacción
      if (
        transaccion.tipoTransaccion === 'TRANSFERENCIA' &&
        cuentaOrigen &&
        cuentaDestino
      ) {
        // Devolver dinero al origen (monto total incluyendo comisión)
        const nuevoSaldoOrigen =
          parseFloat(cuentaOrigen.saldo) + parseFloat(transaccion.montoTotal);
        // Quitar dinero del destino (solo monto sin comisión)
        const nuevoSaldoDestino =
          parseFloat(cuentaDestino.saldo) - parseFloat(transaccion.monto);

        if (nuevoSaldoDestino < 0) {
          throw new Error(
            'El destinatario no tiene saldo suficiente para la reversión',
          );
        }

        await cuentaOrigen.update(
          { saldo: nuevoSaldoOrigen },
          { transaction: t },
        );
        await cuentaDestino.update(
          { saldo: nuevoSaldoDestino },
          { transaction: t },
        );
      } else if (transaccion.tipoTransaccion === 'RECARGA' && cuentaDestino) {
        // Quitar la recarga del destino
        const nuevoSaldo =
          parseFloat(cuentaDestino.saldo) - parseFloat(transaccion.monto);
        if (nuevoSaldo < 0) {
          throw new Error(
            'La cuenta no tiene saldo suficiente para la reversión',
          );
        }
        await cuentaDestino.update({ saldo: nuevoSaldo }, { transaction: t });
      } else if (
        transaccion.tipoTransaccion === 'PAGO' &&
        cuentaOrigen &&
        cuentaDestino
      ) {
        // Revertir pago QR
        const nuevoSaldoOrigen =
          parseFloat(cuentaOrigen.saldo) + parseFloat(transaccion.montoTotal);
        const nuevoSaldoDestino =
          parseFloat(cuentaDestino.saldo) - parseFloat(transaccion.monto);

        if (nuevoSaldoDestino < 0) {
          throw new Error(
            'El destinatario no tiene saldo suficiente para la reversión',
          );
        }

        await cuentaOrigen.update(
          { saldo: nuevoSaldoOrigen },
          { transaction: t },
        );
        await cuentaDestino.update(
          { saldo: nuevoSaldoDestino },
          { transaction: t },
        );
      }

      // Actualizar estado de la transacción
      await transaccion.update(
        {
          estado: 'REVERSADA',
          descripcion: `${transaccion.descripcion || ''} [REVERSADA: ${motivo}]`,
        },
        { transaction: t },
      );

      await t.commit();

      return {
        exito: true,
        transaccion,
        mensaje: 'Transacción reversada exitosamente',
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // SERVICIO OBTENER SOLICITUDES DE COBRO PENDIENTES
  async obtenerSolicitudesCobro(clienteId) {
    return await Transaccion.findAll({
      where: {
        destinoId: clienteId,
        tipoTransaccion: 'PAGO',
        estado: 'PENDIENTE',
        fechaExpiracion: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  // Helpers
  generarNumeroCuenta() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${timestamp.slice(-10)}${random}`;
  }

  generarReferencia(prefijo) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefijo}-${timestamp}-${random}`;
  }
}

export default new ClienteService();
