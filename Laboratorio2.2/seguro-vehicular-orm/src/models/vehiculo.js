import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Vehiculo = sequelize.define(
  'Vehiculo',
  {
    id_vehiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La marca es obligatoria',
        },
      },
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El modelo es obligatorio',
        },
      },
    },
    anio_fabricacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El año debe ser un número entero',
        },
        min: {
          args: [1900],
          msg: 'El año de fabricación debe ser mayor a 1900',
        },
      },
    },
    placa: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    valor_mercado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'El valor de mercado debe ser un número decimal',
        },
        min: {
          args: [0],
          msg: 'El valor de mercado debe ser mayor a 0',
        },
      },
    },
    tipo_vehiculo: {
      type: DataTypes.ENUM('SEDAN', 'SUV', 'CAMIONETA', 'OTRO'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['SEDAN', 'SUV', 'CAMIONETA', 'OTRO']],
          msg: 'El tipo de vehículo debe ser SEDAN, SUV, CAMIONETA u OTRO',
        },
      },
    },
    uso_vehiculo: {
      type: DataTypes.ENUM('PERSONAL', 'COMERCIAL'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['PERSONAL', 'COMERCIAL']],
          msg: 'El uso del vehículo debe ser PERSONAL o COMERCIAL',
        },
      },
    },
  },
  {
    tableName: 'Vehiculo',
    timestamps: false,
  }
);
