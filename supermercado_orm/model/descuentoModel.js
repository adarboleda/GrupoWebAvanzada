import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

// Crear una clase para el modelo de Descuento
class Descuento extends Model {
  //Método para calcular el descuento según el número escogido al azar
  calcularDescuento() {
    const numero = this.numeroEscogido;
    const monto = this.monto;
    let porcentajeDescuento = 0;

    // Determinar el porcentaje de descuento según el número escogido
    if (numero < 74) {
      porcentajeDescuento = 15; // 15% de descuento
    } else {
      porcentajeDescuento = 20; // 20% de descuento
    }

    // Calcular cuánto dinero se le descuenta
    const montoDescuento = monto * (porcentajeDescuento / 100);
    const totalAPagar = monto - montoDescuento;

    return {
      numeroEscogido: numero,
      monto: monto,
      porcentajeDescuento: porcentajeDescuento,
      montoDescuento: montoDescuento,
      totalAPagar: totalAPagar,
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
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
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
    sequelize,
    modelName: "Descuento",
    tableName: "descuentos",
    timestamps: true,
  }
);

export default Descuento;
