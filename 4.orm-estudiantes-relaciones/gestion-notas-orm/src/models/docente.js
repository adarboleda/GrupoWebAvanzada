import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Docente = sequelize.define(
  "Docente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "docentes",
    timestamps: false,
  }
);
