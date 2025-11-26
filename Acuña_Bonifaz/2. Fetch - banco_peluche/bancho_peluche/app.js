import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './src/config/mongo.js';
import clienteRoutes from './routes/cliente.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/clientes', clienteRoutes);

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Banco Bandido escuchando en http://localhost:${PORT}`);
});
