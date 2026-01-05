import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

/**
 * Modelo para representar a un empleado
 * Ejercicio 2: Reajuste de sueldos según antigüedad
 * Autor: Esteban Santos
 * 
 * RESPONSABILIDAD DEL MODELO:
 * - Representar a un empleado con su información de entrada (años y sueldo)
 * - NO calcula; solo define la estructura
 */

class Empleado extends Model {
  // El modelo solo define la estructura de datos
  // NO contiene lógica de cálculo
}

// Definir el modelo (Estructura de la tabla)
Empleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreEmpleado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre del empleado no puede estar vacío"
        }
      }
    },
    antiguedad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "La antigüedad no puede ser negativa"
        },
        isInt: {
          msg: "La antigüedad debe ser un número entero"
        }
      },
    },
    sueldoActual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: "El sueldo debe ser mayor a 0"
        }
      },
    },
  },
  {
    sequelize, // Conexión a la base de datos
    modelName: "Empleado", // Nombre del modelo
    tableName: "empleados", // Nombre de la tabla en la BD
    timestamps: true, // Para que sequelize maneje createdAt y updatedAt
  }
);

export default Empleado;
