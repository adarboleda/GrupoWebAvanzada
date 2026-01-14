import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Equipo from './equipo.js';

class Jugador extends Model {}

Jugador.init(
  {
    id_jugador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Equipo,
        key: 'id_equipo',
      },
    },
  },
  {
    sequelize,
    modelName: 'Jugador',
    tableName: 'jugadores',
    timestamps: true,
  }
);

// Definir relaciones
Equipo.hasMany(Jugador, {
  foreignKey: 'id_equipo',
  as: 'jugadores',
});

Jugador.belongsTo(Equipo, {
  foreignKey: 'id_equipo',
  as: 'equipo',
});

export default Jugador;
