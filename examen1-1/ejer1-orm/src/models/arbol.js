import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Arbol = sequelize.define(
  'Arbol',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM('Paltos', 'Limones', 'Chirimoyos'),
      allowNull: false,
      comment: 'Tipo de árbol: Paltos, Limones o Chirimoyos',
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio unitario sin IVA',
    },
    descuento_100_300: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Porcentaje de descuento para compras entre 100 y 300 árboles',
    },
    descuento_mas_300: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Porcentaje de descuento para compras mayores a 300 árboles',
    },
  },
  {
    tableName: 'arboles',
    timestamps: true,
  }
);
