import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Equipo = sequelize.define(
  'Equipo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del equipo es obligatorio',
        },
      },
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La ciudad es obligatoria',
        },
      },
    },
  },
  {
    tableName: 'equipos',
    timestamps: true,
  }
);
