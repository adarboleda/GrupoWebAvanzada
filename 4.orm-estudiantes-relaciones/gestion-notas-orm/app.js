import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect, sequelize } from "./src/config/database.js";

// Importar modelos para que se registren
import { Estudiante } from "./src/models/estudiante.js";
import { Nota } from "./src/models/nota.js";

import estudianteRoutes from "./src/routes/estudianteRoutes.js";
import notaRoutes from "./src/routes/notasRoutes.js";

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (_req, res) =>
  res.send("Servidor de gestión de notas funcionando correctamente")
);

// Registrar rutas
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/notas", notaRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    // Sincronizar modelos con la base de datos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
    process.exit(1);
  }
};
iniciarServidor();
