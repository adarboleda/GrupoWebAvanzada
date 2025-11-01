import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect, sequelize } from "./src/config/database.js";

// Importar modelos en orden: primero las entidades base, luego las que tienen relaciones
import { Estudiante } from "./src/models/estudiante.js";
import { Docente } from "./src/models/docente.js";
import { Asignatura } from "./src/models/asignatura.js";
import { Nota } from "./src/models/nota.js";

import estudianteRoutes from "./src/routes/estudianteRoutes.js";
import docenteRoutes from "./src/routes/docenteRoutes.js";
import asignaturaRoutes from "./src/routes/asignaturaRoutes.js";
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
app.use("/api/docentes", docenteRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/notas", notaRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    // Sincronizar modelos con la base de datos
    // ⚠️ ADVERTENCIA: { force: true } ELIMINA y RECREA todas las tablas
    // Usa esto solo cuando cambies la estructura de las tablas
    await sequelize.sync({ alter: true });
    console.log(
      "Modelos sincronizados - Tablas recreadas con nuevas relaciones"
    );

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    process.exit(1);
  }
};
iniciarServidor();
