import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Estudiante } from "./estudiante.js";

export const Nota = sequelize.define(
  "Nota",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    materia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    calificacion: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estudiante,
        key: "id",
      },
    },
  },
  {
    tableName: "notas",
    timestamps: false,
  }
);

// Definir la relación
Estudiante.hasMany(Nota, { foreignKey: "estudianteId" });
Nota.belongsTo(Estudiante, { foreignKey: "estudianteId" });
