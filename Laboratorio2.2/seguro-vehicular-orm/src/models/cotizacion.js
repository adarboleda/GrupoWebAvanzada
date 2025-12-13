import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Conductor } from './conductor.js';
import { Vehiculo } from './vehiculo.js';

export const Cotizacion = sequelize.define(
  'Cotizacion',
  {
    id_cotizacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_conductor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conductor,
        key: 'id_conductor',
      },
    },
    id_vehiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehiculo,
        key: 'id_vehiculo',
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    monto_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El monto base debe ser mayor o igual a 0',
        },
      },
    },
    monto_recargos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: 'El monto de recargos debe ser mayor o igual a 0',
        },
      },
    },
    monto_descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: 'El monto de descuentos debe ser mayor o igual a 0',
        },
      },
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El monto total debe ser mayor o igual a 0',
        },
      },
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'VENCIDA'),
      defaultValue: 'PENDIENTE',
      validate: {
        isIn: {
          args: [['PENDIENTE', 'APROBADA', 'RECHAZADA', 'VENCIDA']],
          msg: 'El estado debe ser PENDIENTE, APROBADA, RECHAZADA o VENCIDA',
        },
      },
    },
    mensaje_rechazo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    acepta_terminos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'Cotizacion',
    timestamps: false,
  }
);

// Definir las relaciones
Cotizacion.belongsTo(Conductor, {
  foreignKey: 'id_conductor',
  as: 'conductor',
});

Cotizacion.belongsTo(Vehiculo, {
  foreignKey: 'id_vehiculo',
  as: 'vehiculo',
});

Conductor.hasMany(Cotizacion, {
  foreignKey: 'id_conductor',
  as: 'cotizaciones',
});

Vehiculo.hasMany(Cotizacion, {
  foreignKey: 'id_vehiculo',
  as: 'cotizaciones',
});
