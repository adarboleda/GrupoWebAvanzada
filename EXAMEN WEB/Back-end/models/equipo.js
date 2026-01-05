import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Equipo extends Model {}

Equipo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estadio: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    fundacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    escudo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    entrenador: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: "Equipo",
    tableName: "equipos",
    timestamps: true,
  }
);

export default Equipo;
