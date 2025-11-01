import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Estudiante } from "./estudiante.js";
import { Asignatura } from "./asignatura.js";

export const Nota = sequelize.define(
  "Nota",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nota1: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 20,
      },
    },
    nota2: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 20,
      },
    },
    nota3: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 20,
      },
    },
    promedio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 20,
      },
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estudiante,
        key: "id",
      },
    },
    asignaturaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Asignatura,
        key: "id",
      },
    },
  },
  {
    tableName: "notas",
    timestamps: false,
  }
);

// Definir relaciones
Estudiante.hasMany(Nota, { foreignKey: "estudianteId", onDelete: "CASCADE" });
Nota.belongsTo(Estudiante, { foreignKey: "estudianteId" });

Asignatura.hasMany(Nota, { foreignKey: "asignaturaId", onDelete: "CASCADE" });
Nota.belongsTo(Asignatura, { foreignKey: "asignaturaId" });
