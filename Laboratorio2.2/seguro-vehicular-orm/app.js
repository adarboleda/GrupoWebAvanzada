import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect, sequelize } from './src/config/database.js';

// Importar modelos en orden: primero las entidades base, luego las que tienen relaciones
import { Equipo } from './src/models/equipo.js';
import { Jugador } from './src/models/jugador.js';

// Importar rutas
import equipoRoutes from './src/routes/equipoRoutes.js';
import jugadorRoutes from './src/routes/jugadorRoutes.js';

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) =>
  res.send('API de Gestión de Equipos y Jugadores funcionando correctamente')
);

// Registrar rutas
app.use('/api/equipos', equipoRoutes);
app.use('/api/jugadores', jugadorRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    // Sincronizar modelos (alter: true actualiza la estructura sin borrar datos)
    // Usar force: true solo en desarrollo para recrear tablas
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente');
    console.log('📋 Tablas: Equipo, Jugador');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('\n⚽ Sistema de Gestión de Equipos y Jugadores');
      console.log(`🌐 Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log('\n📍 Endpoints disponibles:');
      console.log('   - POST   /api/equipos              (Crear equipo)');
      console.log('   - GET    /api/equipos              (Listar equipos)');
      console.log('   - GET    /api/equipos/:id          (Obtener equipo por ID)');
      console.log('   - PUT    /api/equipos/:id          (Actualizar equipo)');
      console.log('   - DELETE /api/equipos/:id          (Eliminar equipo)');
      console.log('   - POST   /api/jugadores            (Crear jugador)');
      console.log('   - GET    /api/jugadores            (Listar jugadores)');
      console.log('   - GET    /api/jugadores/:id        (Obtener jugador por ID)');
      console.log('   - PUT    /api/jugadores/:id        (Actualizar jugador)');
      console.log('   - DELETE /api/jugadores/:id        (Eliminar jugador)');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};
iniciarServidor();
