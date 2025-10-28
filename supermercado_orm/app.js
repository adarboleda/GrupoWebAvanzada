import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import descuentoRoutes from "./routes/descuentoRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (_req, res) =>
  res.send("Servidor de descuentos del supermercado funcionando correctamente")
);

// Registrar rutas
app.use("/api/descuentos", descuentoRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente");

    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados con la base de datos");

    // Iniciar el servidor
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
