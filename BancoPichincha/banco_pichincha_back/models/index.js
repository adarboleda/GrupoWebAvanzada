// Archivo que configura las relaciones entre modelos
import sequelize from '../config/database.js';
import Cliente from './Cliente.js';
import Cuenta from './Cuenta.js';
import Tarjeta from './Tarjeta.js';
import Transaccion from './Transaccion.js';
import VinculacionDeuna from './VinculacionDeuna.js';

// Relaciones Cliente - Cuenta (1:N)
Cliente.hasMany(Cuenta, {
  foreignKey: 'clienteId',
  as: 'cuentas',
});
Cuenta.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente',
});

// Relaciones Cliente - Tarjeta (1:N)
Cliente.hasMany(Tarjeta, {
  foreignKey: 'clienteId',
  as: 'tarjetas',
});
Tarjeta.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente',
});

// Relaciones Cuenta - Tarjeta (1:N)
Cuenta.hasMany(Tarjeta, {
  foreignKey: 'cuentaId',
  as: 'tarjetas',
});
Tarjeta.belongsTo(Cuenta, {
  foreignKey: 'cuentaId',
  as: 'cuenta',
});

// Relaciones Cliente - Transaccion (Origen)
Cliente.hasMany(Transaccion, {
  foreignKey: 'origenId',
  as: 'transaccionesEnviadas',
});
Transaccion.belongsTo(Cliente, {
  foreignKey: 'origenId',
  as: 'clienteOrigen',
});

// Relaciones Cliente - Transaccion (Destino)
Cliente.hasMany(Transaccion, {
  foreignKey: 'destinoId',
  as: 'transaccionesRecibidas',
});
Transaccion.belongsTo(Cliente, {
  foreignKey: 'destinoId',
  as: 'clienteDestino',
});

// Relaciones Cuenta - Transaccion (Origen)
Cuenta.hasMany(Transaccion, {
  foreignKey: 'cuentaOrigenId',
  as: 'transaccionesSalida',
});
Transaccion.belongsTo(Cuenta, {
  foreignKey: 'cuentaOrigenId',
  as: 'cuentaOrigen',
});

// Relaciones Cuenta - Transaccion (Destino)
Cuenta.hasMany(Transaccion, {
  foreignKey: 'cuentaDestinoId',
  as: 'transaccionesEntrada',
});
Transaccion.belongsTo(Cuenta, {
  foreignKey: 'cuentaDestinoId',
  as: 'cuentaDestino',
});

// Relaciones Cliente - VinculacionDeuna (1:N)
Cliente.hasMany(VinculacionDeuna, {
  foreignKey: 'clienteId',
  as: 'vinculacionesDeuna',
});
VinculacionDeuna.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente',
});

// Relaciones Cuenta - VinculacionDeuna (1:N)
Cuenta.hasMany(VinculacionDeuna, {
  foreignKey: 'cuentaId',
  as: 'vinculacionesDeuna',
});
VinculacionDeuna.belongsTo(Cuenta, {
  foreignKey: 'cuentaId',
  as: 'cuenta',
});

// Sincronizar modelos con la base de datos
export async function syncDatabase(force = false) {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error sincronizando la base de datos:', error);
    throw error;
  }
}

// Exportar modelos y sequelize
export { sequelize, Cliente, Cuenta, Tarjeta, Transaccion, VinculacionDeuna };
