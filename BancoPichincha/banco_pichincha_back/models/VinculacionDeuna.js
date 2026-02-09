import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

// Crear clase VinculacionDeuna
class VinculacionDeuna extends Model {}

// Definir el modelo VinculacionDeuna
VinculacionDeuna.init(
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
      allowNull: false,
      references: {
        model: 'cuentas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    alias: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment: 'Alias personalizado para pago rápido',
    },
    numeroIdentificacion: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Número de identificación de pago rápido',
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Token de vinculación',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    esPrincipal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica si es la cuenta principal para Deuna',
    },
  },
  {
    sequelize,
    modelName: 'VinculacionDeuna',
    tableName: 'vinculaciones_deuna',
    timestamps: true,
  },
);

export default VinculacionDeuna;
