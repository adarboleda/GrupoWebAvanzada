//configurar el sequelize para conectar con mysql
//importat libreria
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//cargar las variables del archivo .env
dotenv.config();

//Crear la conexion a la base de datos utilizando las variables de .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, //desactivar los mensajes de log en consola
  }
);

//exportar la conexion para usarla en otros archivos
export default sequelize;
