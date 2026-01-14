import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Equipo extends Model {}

Equipo.init(
  {
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Equipo',
    tableName: 'equipos',
    timestamps: true,
  }
);

export default Equipo;
