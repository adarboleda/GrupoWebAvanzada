import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import { syncDatabase } from './models/index.js';
import clienteRoutes from './routes/cliente.routes.js';
import reportesRoutes from './routes/reportes.routes.js';

// Obtener la ruta del directorio actual (compatibilidad con ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/reportes', reportesRoutes);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos MySQL
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');

    // Sincronizar modelos con la base de datos
    await syncDatabase(false); // false = no eliminar tablas existentes

    // Iniciar el servidor solo después de conectar a MySQL
    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor Banco Pichincha escuchando en http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();
