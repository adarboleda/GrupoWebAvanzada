//Conexión Sequelize a la base de datos
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//Cargar las variables del archivo .env
dotenv.config();

//Crear la conexión a la base de datos utilizando las variables de .env
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, //Desactivar los mensajes de log en consola
  }
);

//Exportar la conexión para usarla en otros archivos
export const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};
