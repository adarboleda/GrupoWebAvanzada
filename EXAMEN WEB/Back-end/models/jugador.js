import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Jugador extends Model {}

Jugador.init(
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
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nacionalidad: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    posicion: {
      type: DataTypes.ENUM('portero', 'defensa', 'mediocampista', 'delantero'),
      allowNull: false,
    },
    numeroCamiseta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 99
      }
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    equipoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    modelName: "Jugador",
    tableName: "jugadores",
    timestamps: true,
  }
);

export default Jugador;
