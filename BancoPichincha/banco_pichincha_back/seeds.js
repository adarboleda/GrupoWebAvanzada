import sequelize from './config/database.js';
import { Cliente, Cuenta, Tarjeta, Transaccion, VinculacionDeuna, syncDatabase } from './models/index.js';
import crypto from 'crypto';

// Función auxiliar para generar códigos DEUNA únicos
function generarCodigoDeuna() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Función auxiliar para generar números de cuenta
function generarNumeroCuenta() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${timestamp.slice(-10)}${random}`;
}

// Función auxiliar para generar número de tarjeta
function generarNumeroTarjeta() {
  let numero = '4'; // Empieza con 4 (VISA)
  for (let i = 0; i < 15; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
}

// Función auxiliar para generar fechas futuras
function generarFechaExpiracion() {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + 3);
  return fecha.toISOString().split('T')[0];
}

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando proceso de seeding...');

    // Sincronizar base de datos (eliminar y recrear tablas)
    await syncDatabase(true);
    console.log('✅ Base de datos sincronizada');

    // ========== DATOS DE CLIENTES ==========
    const clientesData = [
      {
        nombre: 'Juan Pérez García',
        cedula: '1712345678',
        email: 'juan.perez@example.com',
        telefono: '0987654321',
        usuario: 'juanperez',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'María González López',
        cedula: '1723456789',
        email: 'maria.gonzalez@example.com',
        telefono: '0976543210',
        usuario: 'mariagonzalez',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Carlos Rodríguez Sánchez',
        cedula: '1734567890',
        email: 'carlos.rodriguez@example.com',
        telefono: '0965432109',
        usuario: 'carlosrodriguez',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Ana Martínez Torres',
        cedula: '1745678901',
        email: 'ana.martinez@example.com',
        telefono: '0954321098',
        usuario: 'anamartinez',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Luis Fernández Ruiz',
        cedula: '1756789012',
        email: 'luis.fernandez@example.com',
        telefono: '0943210987',
        usuario: 'luisfernandez',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Patricia Díaz Moreno',
        cedula: '1767890123',
        email: 'patricia.diaz@example.com',
        telefono: '0932109876',
        usuario: 'patriciadiaz',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Roberto Vargas Castro',
        cedula: '1778901234',
        email: 'roberto.vargas@example.com',
        telefono: '0921098765',
        usuario: 'robertovargas',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Laura Romero Jiménez',
        cedula: '1789012345',
        email: 'laura.romero@example.com',
        telefono: '0910987654',
        usuario: 'lauraromero',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Diego Herrera Núñez',
        cedula: '1790123456',
        email: 'diego.herrera@example.com',
        telefono: '0909876543',
        usuario: 'diegoherrera',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      },
      {
        nombre: 'Sofia Mendoza Vega',
        cedula: '1701234567',
        email: 'sofia.mendoza@example.com',
        telefono: '0998765432',
        usuario: 'sofiamendoza',
        password: 'password123',
        codigoDeuna: generarCodigoDeuna(),
        activo: true
      }
    ];

    const clientes = await Cliente.bulkCreate(clientesData);
    console.log('✅ 10 clientes creados');

    // ========== DATOS DE CUENTAS ==========
    const cuentasData = [];
    clientes.forEach((cliente, index) => {
      // Cada cliente tiene 1-2 cuentas
      cuentasData.push({
        clienteId: cliente.id,
        numeroCuenta: generarNumeroCuenta(),
        tipoCuenta: 'AHORROS',
        saldo: (Math.random() * 5000 + 500).toFixed(2), // Saldo entre $500 y $5500
        moneda: 'USD',
        activo: true,
        limiteTransferencia: 5000.00
      });

      // Algunos clientes tienen cuenta corriente
      if (index % 2 === 0) {
        cuentasData.push({
          clienteId: cliente.id,
          numeroCuenta: generarNumeroCuenta(),
          tipoCuenta: 'CORRIENTE',
          saldo: (Math.random() * 3000 + 300).toFixed(2),
          moneda: 'USD',
          activo: true,
          limiteTransferencia: 10000.00
        });
      }
    });

    const cuentas = await Cuenta.bulkCreate(cuentasData);
    console.log(`✅ ${cuentas.length} cuentas creadas`);

    // ========== DATOS DE TARJETAS ==========
    const tarjetasData = [];
    cuentas.forEach((cuenta, index) => {
      const cliente = clientes.find(c => c.id === cuenta.clienteId);
      
      // Tarjeta de débito
      tarjetasData.push({
        clienteId: cuenta.clienteId,
        cuentaId: cuenta.id,
        numeroTarjeta: generarNumeroTarjeta(),
        tipoTarjeta: 'DEBITO',
        marca: 'VISA',
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        fechaExpiracion: generarFechaExpiracion(),
        limiteCredito: null,
        saldoDisponible: null,
        activo: true
      });

      // Algunos clientes tienen tarjeta de crédito
      if (index % 3 === 0) {
        const limiteCredito = (Math.random() * 3000 + 1000).toFixed(2);
        tarjetasData.push({
          clienteId: cuenta.clienteId,
          cuentaId: cuenta.id,
          numeroTarjeta: generarNumeroTarjeta(),
          tipoTarjeta: 'CREDITO',
          marca: Math.random() > 0.5 ? 'MASTERCARD' : 'VISA',
          cvv: Math.floor(Math.random() * 900 + 100).toString(),
          fechaExpiracion: generarFechaExpiracion(),
          limiteCredito: limiteCredito,
          saldoDisponible: limiteCredito,
          activo: true
        });
      }
    });

    const tarjetas = await Tarjeta.bulkCreate(tarjetasData);
    console.log(`✅ ${tarjetas.length} tarjetas creadas`);

    // ========== DATOS DE VINCULACIONES DEUNA ==========
    const vinculacionesData = [];
    clientes.forEach((cliente) => {
      const cuentaPrincipal = cuentas.find(c => c.clienteId === cliente.id);
      
      if (cuentaPrincipal) {
        vinculacionesData.push({
          clienteId: cliente.id,
          cuentaId: cuentaPrincipal.id,
          alias: cliente.usuario,
          numeroIdentificacion: cliente.cedula,
          token: cliente.codigoDeuna,
          activo: true,
          esPrincipal: true
        });
      }
    });

    const vinculaciones = await VinculacionDeuna.bulkCreate(vinculacionesData);
    console.log(`✅ ${vinculaciones.length} vinculaciones Deuna creadas`);

    // ========== DATOS DE TRANSACCIONES ==========
    const transaccionesData = [];
    
    // Generar transacciones de RECARGA
    for (let i = 0; i < 10; i++) {
      const cuenta = cuentas[Math.floor(Math.random() * cuentas.length)];
      const monto = (Math.random() * 500 + 50).toFixed(2);
      const comision = (parseFloat(monto) * 0.005).toFixed(2);
      const montoTotal = (parseFloat(monto) + parseFloat(comision)).toFixed(2);
      
      transaccionesData.push({
        tipoTransaccion: 'RECARGA',
        origenId: cuenta.clienteId,
        cuentaDestinoId: cuenta.id,
        monto: parseFloat(monto),
        comision: parseFloat(comision),
        montoTotal: parseFloat(montoTotal),
        estado: 'CONFIRMADA',
        descripcion: 'Recarga de saldo vía Deuna',
        referencia: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        ipOrigen: `192.168.1.${Math.floor(Math.random() * 255)}`,
        navegador: 'Chrome'
      });
    }

    // Generar transacciones de TRANSFERENCIA
    for (let i = 0; i < 15; i++) {
      const cuentaOrigen = cuentas[Math.floor(Math.random() * cuentas.length)];
      let cuentaDestino = cuentas[Math.floor(Math.random() * cuentas.length)];
      
      // Asegurar que no sea la misma cuenta
      while (cuentaDestino.id === cuentaOrigen.id) {
        cuentaDestino = cuentas[Math.floor(Math.random() * cuentas.length)];
      }
      
      const monto = (Math.random() * 300 + 20).toFixed(2);
      const comision = (parseFloat(monto) * 0.01).toFixed(2);
      const montoTotal = (parseFloat(monto) + parseFloat(comision)).toFixed(2);
      
      transaccionesData.push({
        tipoTransaccion: 'TRANSFERENCIA',
        origenId: cuentaOrigen.clienteId,
        destinoId: cuentaDestino.clienteId,
        cuentaOrigenId: cuentaOrigen.id,
        cuentaDestinoId: cuentaDestino.id,
        monto: parseFloat(monto),
        comision: parseFloat(comision),
        montoTotal: parseFloat(montoTotal),
        estado: 'CONFIRMADA',
        descripcion: 'Transferencia vía Deuna',
        referencia: `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        ipOrigen: `192.168.1.${Math.floor(Math.random() * 255)}`,
        navegador: 'Firefox'
      });
    }

    const transacciones = await Transaccion.bulkCreate(transaccionesData);
    console.log(`✅ ${transacciones.length} transacciones creadas`);

    console.log('\n🎉 ¡Seeding completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  - ${clientes.length} clientes`);
    console.log(`  - ${cuentas.length} cuentas`);
    console.log(`  - ${tarjetas.length} tarjetas`);
    console.log(`  - ${vinculaciones.length} vinculaciones Deuna`);
    console.log(`  - ${transacciones.length} transacciones`);
    console.log('\n🔑 Credenciales de acceso (usuario/password):');
    clientes.forEach(c => {
      console.log(`  - ${c.usuario} / password123 (Código Deuna: ${c.codigoDeuna})`);
    });

  } catch (error) {
    console.error('❌ Error en el seeding:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar seeding
seedDatabase();
