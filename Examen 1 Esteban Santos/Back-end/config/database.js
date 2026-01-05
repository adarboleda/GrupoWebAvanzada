/**
 * Configuración de Sequelize para conectar con MySQL
 * Ejercicio 8: Cálculo de Cuotas de Seguros
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar las variables del archivo .env
dotenv.config();

// Crear la conexión a la base de datos utilizando las variables de .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: console.log, // Activar los mensajes de log en consola
  }
);

// Exportar la conexión para usarla en otros archivos
export default sequelize;
