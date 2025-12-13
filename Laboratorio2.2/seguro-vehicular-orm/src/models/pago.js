import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Cotizacion } from './cotizacion.js';

export const Pago = sequelize.define(
  'Pago',
  {
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cotizacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cotizacion,
        key: 'id_cotizacion',
      },
    },
    tipo_tarjeta: {
      type: DataTypes.ENUM('CREDITO', 'DEBITO'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CREDITO', 'DEBITO']],
          msg: 'El tipo de tarjeta debe ser CREDITO o DEBITO',
        },
      },
    },
    modalidad_pago: {
      type: DataTypes.ENUM('CONTADO', 'DIFERIDO'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CONTADO', 'DIFERIDO']],
          msg: 'La modalidad de pago debe ser CONTADO o DIFERIDO',
        },
      },
    },
    numero_cuotas: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: 'El número de cuotas debe ser al menos 1',
        },
      },
    },
    monto_pagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El monto pagado debe ser mayor a 0',
        },
      },
    },
    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado_transaccion: {
      type: DataTypes.ENUM('EXITOSO', 'FALLIDO', 'PENDIENTE'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['EXITOSO', 'FALLIDO', 'PENDIENTE']],
          msg: 'El estado de transacción debe ser EXITOSO, FALLIDO o PENDIENTE',
        },
      },
    },
    codigo_referencia_pasarela: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'Pago',
    timestamps: false,
  }
);

// Definir la relación
Pago.belongsTo(Cotizacion, {
  foreignKey: 'id_cotizacion',
  as: 'cotizacion',
});

Cotizacion.hasMany(Pago, {
  foreignKey: 'id_cotizacion',
  as: 'pagos',
});
