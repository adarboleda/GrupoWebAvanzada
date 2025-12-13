import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de usuario es obligatorio',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña es obligatoria',
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
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido',
        },
      },
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'OPERADOR'),
      defaultValue: 'OPERADOR',
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'Usuario',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      },
    },
  }
);

// Método para comparar contraseñas
Usuario.prototype.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
