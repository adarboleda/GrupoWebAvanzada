//configurar el sequelize para conectar con mysql
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//cargar las variables del archivo .env
dotenv.config();

//crear la conexion a la BDD
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);

export default sequelize;
