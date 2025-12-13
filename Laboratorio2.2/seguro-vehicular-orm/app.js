import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect, sequelize } from './src/config/database.js';

// Importar modelos en orden: primero las entidades base, luego las que tienen relaciones
import { Conductor } from './src/models/conductor.js';
import { Vehiculo } from './src/models/vehiculo.js';
import { Cotizacion } from './src/models/cotizacion.js';
import { Pago } from './src/models/pago.js';
import { Usuario } from './src/models/usuario.js';

// Importar rutas
import conductorRoutes from './src/routes/conductorRoutes.js';
import vehiculoRoutes from './src/routes/vehiculoRoutes.js';
import cotizacionRoutes from './src/routes/cotizacionRoutes.js';
import pagoRoutes from './src/routes/pagoRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) =>
  res.send('API de Cotización de Seguro Vehicular funcionando correctamente')
);

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/conductores', conductorRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/pagos', pagoRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    // Sincronizar modelos (alter: true actualiza la estructura sin borrar datos)
    // Usar force: true solo en desarrollo para recrear tablas
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente');
    console.log('📋 Tablas: Conductor, Vehiculo, Cotizacion, Pago');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('\n🚗 Sistema de Cotización de Seguro Vehicular');
      console.log(`🌐 Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log('\n📍 Endpoints disponibles:');
      console.log('   - POST   /api/conductores          (Crear conductor)');
      console.log('   - GET    /api/conductores          (Listar conductores)');
      console.log('   - POST   /api/vehiculos            (Crear vehículo)');
      console.log('   - GET    /api/vehiculos            (Listar vehículos)');
      console.log(
        '   - POST   /api/cotizaciones/calcular (Calcular cotización)'
      );
      console.log(
        '   - GET    /api/cotizaciones         (Listar cotizaciones)'
      );
      console.log('   - POST   /api/pagos/procesar       (Procesar pago)');
      console.log('   - GET    /api/pagos                (Listar pagos)');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};
iniciarServidor();
