import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

//Crear una clase

class Obrero extends Model {
  //Metodo para calcular el salario del obrero
  calcularSalario() {
    const horas = this.horasTrabajadas;
    //si trbaja 40 o menos vale $20
    const horasNormales = Math.min(horas, 40);
    //si trabaja mas de 40 horas, las primeras 40 valen $20 y las extras $25
    const horasExtras = Math.max(horas - 40, 0);
    const pagoNormal = horasNormales * 20;
    const pagoExtra = horasExtras * 25;
    const total = pagoNormal + pagoExtra;
    return { total, pagoNormal, pagoExtra, horasNormales, horasExtras };
  }
}

//definir el modelo (Estructura de la tabla)

Obrero.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreCompleto: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    horasTrabajadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, //conexion a la base de datos
    modelName: "Obrero", //nombre del modelo
    timestamps: true, //para que sequelize maneje createdAt y updatedAt
  }
);

export default Obrero;
