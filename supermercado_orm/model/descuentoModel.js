import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

// Crear una clase para el modelo de Descuento
class Descuento extends Model {
  //Método para calcular el porcentaje de descuento según el número escogido al azar
  calcularDescuento() {
    const numero = this.numeroEscogido;
    let porcentajeDescuento = 0;

    // Determinar el porcentaje de descuento según el número escogido
    if (numero < 74) {
      porcentajeDescuento = 15;
    } else {
      porcentajeDescuento = 20;
    }

    return {
      numeroEscogido: numero,
      porcentajeDescuento: porcentajeDescuento,
    };
  }
}

// Definir el modelo (Estructura de la tabla)
Descuento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numeroEscogido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize, // Conexión a la base de datos
    modelName: "Descuento", // Nombre del modelo
    tableName: "descuentos", // Nombre de la tabla en la BD
    timestamps: true, // Para que Sequelize maneje createdAt y updatedAt
  }
);

export default Descuento;
