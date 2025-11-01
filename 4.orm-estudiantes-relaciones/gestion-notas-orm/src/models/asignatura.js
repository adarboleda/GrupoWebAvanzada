import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Docente } from "./docente.js";

export const Asignatura = sequelize.define(
  "Asignatura",
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
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    creditos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    docenteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Docente,
        key: "id",
      },
    },
  },
  {
    tableName: "asignaturas",
    timestamps: false,
  }
);

// Relación: Docente tiene muchas Asignaturas
Docente.hasMany(Asignatura, { foreignKey: "docenteId", onDelete: "CASCADE" });
Asignatura.belongsTo(Docente, { foreignKey: "docenteId" });
