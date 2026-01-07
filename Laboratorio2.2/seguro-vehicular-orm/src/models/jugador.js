import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Equipo } from './equipo.js';

export const Jugador = sequelize.define(
  'Jugador',
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
          msg: 'El nombre del jugador es obligatorio',
        },
      },
    },
    posicion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La posición es obligatoria',
        },
      },
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El número debe ser un entero',
        },
        min: {
          args: [1],
          msg: 'El número debe ser mayor a 0',
        },
        max: {
          args: [99],
          msg: 'El número no puede ser mayor a 99',
        },
      },
    },
    equipoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Equipo,
        key: 'id',
      },
      validate: {
        notEmpty: {
          msg: 'El equipo es obligatorio',
        },
      },
    },
  },
  {
    tableName: 'jugadores',
    timestamps: true,
  }
);

Jugador.belongsTo(Equipo, {
  foreignKey: 'equipoId',
  as: 'equipo',
});

Equipo.hasMany(Jugador, {
  foreignKey: 'equipoId',
  as: 'jugadores',
});
