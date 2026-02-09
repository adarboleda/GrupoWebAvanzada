import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Crear clase Transaccion
class Transaccion extends Model {}

// Definir el modelo Transaccion
Transaccion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoTransaccion: {
      type: DataTypes.ENUM('RECARGA', 'TRANSFERENCIA', 'RETIRO', 'PAGO'),
      allowNull: false,
    },
    origenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id',
      },
      comment: 'Cliente que realiza la transacción',
    },
    destinoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id',
      },
      comment: 'Cliente que recibe la transacción',
    },
    cuentaOrigenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentas',
        key: 'id',
      },
      comment: 'Cuenta origen de la transacción',
    },
    cuentaDestinoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentas',
        key: 'id',
      },
      comment: 'Cuenta destino de la transacción',
    },
    monto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'El monto debe ser mayor a 0',
        },
      },
    },
    comision: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    montoTotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Monto + comisión',
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADA', 'FALLIDA', 'REVERSADA'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Referencia única de la transacción',
    },
    codigoQR: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Código QR para el pago',
    },
    fechaExpiracion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de expiración para solicitudes de cobro',
    },
    // Auditoría
    ipOrigen: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    navegador: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Transaccion',
    tableName: 'transacciones',
    timestamps: true,
  },
);

export default Transaccion;
