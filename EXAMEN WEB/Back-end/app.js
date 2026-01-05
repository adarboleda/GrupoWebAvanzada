import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

import equipoRoutes from "./routes/equipoRoutes.js";
import jugadorRoutes from "./routes/jugadorRoutes.js";

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (_req, res) => res.send("Sistema de Gestión de Equipos y Jugadores - API funcionando correctamente"));

// Registrar rutas
app.use("/api/equipos", equipoRoutes);
app.use("/api/jugadores", jugadorRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea tablas si no existen
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  }
};

iniciarServidor();
