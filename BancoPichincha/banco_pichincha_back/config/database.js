// Configurar Sequelize para conectar con MySQL
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

// Crear la conexión a la base de datos utilizando las variables de .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Desactivar los mensajes de log en consola
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Exportar la conexión para usarla en otros archivos
export default sequelize;
