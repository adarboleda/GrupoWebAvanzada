import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Crear clase Tarjeta
class Tarjeta extends Model {}

// Definir el modelo Tarjeta
Tarjeta.init(
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
    cuentaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Cuenta asociada a la tarjeta',
    },
    numeroTarjeta: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    tipoTarjeta: {
      type: DataTypes.ENUM('DEBITO', 'CREDITO'),
      allowNull: false,
    },
    marca: {
      type: DataTypes.ENUM('VISA', 'MASTERCARD', 'AMERICAN_EXPRESS'),
      allowNull: false,
      defaultValue: 'VISA',
    },
    cvv: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    fechaExpiracion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    limiteCredito: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Solo para tarjetas de crédito',
    },
    saldoDisponible: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Saldo disponible en tarjeta de crédito',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Tarjeta',
    tableName: 'tarjetas',
    timestamps: true,
  },
);

export default Tarjeta;
