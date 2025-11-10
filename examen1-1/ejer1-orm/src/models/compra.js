import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Arbol } from './arbol.js';

export const Compra = sequelize.define(
  'Compra',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre del cliente',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'compras',
    timestamps: true,
  }
);

// Tabla intermedia para la relación muchos a muchos entre Compra y Arbol
export const CompraDetalle = sequelize.define(
  'CompraDetalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Cantidad de árboles de este tipo',
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio unitario al momento de la compra',
    },
    descuento_aplicado: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Porcentaje de descuento aplicado',
    },
    subtotal_sin_iva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Subtotal sin IVA ni descuentos',
    },
    descuento_monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Monto del descuento',
    },
    subtotal_con_descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Subtotal después del descuento',
    },
    iva_monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto del IVA (19%)',
    },
    total_final: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total final con IVA',
    },
  },
  {
    tableName: 'compra_detalles',
    timestamps: true,
  }
);

// Relaciones
Compra.belongsToMany(Arbol, {
  through: CompraDetalle,
  foreignKey: 'compra_id',
  as: 'arboles',
});

Arbol.belongsToMany(Compra, {
  through: CompraDetalle,
  foreignKey: 'arbol_id',
  as: 'compras',
});

// Relaciones directas para facilitar consultas
Compra.hasMany(CompraDetalle, {
  foreignKey: 'compra_id',
  as: 'detalles',
});

CompraDetalle.belongsTo(Compra, {
  foreignKey: 'compra_id',
});

CompraDetalle.belongsTo(Arbol, {
  foreignKey: 'arbol_id',
  as: 'arbol',
});
