import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Conductor = sequelize.define(
  'Conductor',
  {
    id_conductor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identificacion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'La identificación no puede estar vacía',
        },
      },
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre completo es obligatorio',
        },
      },
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Debe ser una fecha válida',
        },
        notNull: {
          msg: 'La fecha de nacimiento es obligatoria',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido',
        },
      },
    },
    numero_accidentes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El número de accidentes no puede ser negativo',
        },
      },
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Conductor',
    timestamps: false,
  }
);
