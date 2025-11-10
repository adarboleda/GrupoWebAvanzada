import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect, sequelize } from './src/config/database.js';

// Importar modelos
import { Arbol } from './src/models/arbol.js';
import { Compra, CompraDetalle } from './src/models/compra.js';

// Importar rutas
import arbolRoutes from './src/routes/arbolRoutes.js';
import compraRoutes from './src/routes/compraRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) =>
  res.json({
    message: 'API Criadero de Árboles funcionando correctamente',
    endpoints: {
      arboles: '/api/arboles',
      compras: '/api/compras',
    },
  })
);

// Registrar rutas
app.use('/api/arboles', arbolRoutes);
app.use('/api/compras', compraRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
