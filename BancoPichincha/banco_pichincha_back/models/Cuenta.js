import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Crear clase Cuenta
class Cuenta extends Model {}

// Definir el modelo Cuenta
Cuenta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    numeroCuenta: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    tipoCuenta: {
      type: DataTypes.ENUM('AHORROS', 'CORRIENTE'),
      allowNull: false,
      defaultValue: 'AHORROS',
    },
    saldo: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: 'El saldo no puede ser negativo',
        },
      },
    },
    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    limiteTransferencia: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 5000.0,
      comment: 'Límite diario de transferencias',
    },
  },
  {
    sequelize,
    modelName: 'Cuenta',
    tableName: 'cuentas',
    timestamps: true,
  },
);

export default Cuenta;
