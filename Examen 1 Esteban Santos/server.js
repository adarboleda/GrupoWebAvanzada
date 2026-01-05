import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./Back-end/config/database.js";
import empleadoRoutes from "./routes/empleado.routes.js";

/**
 * Servidor principal de la API REST
 * Ejercicio 2: Reajuste de Sueldos
 * Autor: Esteban Santos
 */

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ruta de bienvenida
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API REST - Sistema de Reajuste de Sueldos",
    autor: "Esteban Santos",
    version: "1.0.0",
    descripcion: "API para calcular reajustes de sueldos según antigüedad",
    ejercicio: "Ejercicio 2",
    endpoints: {
      empleados: "/api/empleados",
      calcularReajuste: "/api/empleados/:id/calcular",
      calcularDirecto: "/api/empleados/calcular"
    },
    reglas: {
      "antigüedad <= 10 años": "12%, 10% o 8% según sueldo",
      "10 < antigüedad <= 20 años": "14%, 12% o 10% según sueldo"
    }
  });
});

// Registrar rutas
app.use("/api/empleados", empleadoRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    message: `La ruta ${req.url} no existe en esta API`,
    endpoints_disponibles: {
      raiz: "/",
      empleados: "/api/empleados"
    }
  });
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message: err.message
  });
});

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Conexión a la base de datos establecida correctamente");
    
    await sequelize.sync(); // Crea tablas si no existen
    console.log("✓ Tablas sincronizadas");
    
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log("\n╔═══════════════════════════════════════════════════════╗");
      console.log("║   API REST - Sistema de Reajuste de Sueldos          ║");
      console.log("║   Ejercicio 2 - Esteban Santos                        ║");
      console.log("╚═══════════════════════════════════════════════════════╝");
      console.log(`\n✓ Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log("\nEndpoints disponibles:");
      console.log(`  → GET    http://localhost:${PORT}/`);
      console.log(`  → GET    http://localhost:${PORT}/api/empleados`);
      console.log(`  → POST   http://localhost:${PORT}/api/empleados`);
      console.log(`  → GET    http://localhost:${PORT}/api/empleados/:id`);
      console.log(`  → PUT    http://localhost:${PORT}/api/empleados/:id`);
      console.log(`  → DELETE http://localhost:${PORT}/api/empleados/:id`);
      console.log(`  → GET    http://localhost:${PORT}/api/empleados/:id/calcular`);
      console.log(`  → POST   http://localhost:${PORT}/api/empleados/calcular`);
      console.log("\nReglas de negocio:");
      console.log("  Hasta 10 años:");
      console.log("    • Sueldo <= $300,000: 12% reajuste");
      console.log("    • Sueldo $300,001 - $500,000: 10% reajuste");
      console.log("    • Sueldo > $500,000: 8% reajuste");
      console.log("  Más de 10 hasta 20 años:");
      console.log("    • Sueldo <= $300,000: 14% reajuste");
      console.log("    • Sueldo $300,001 - $500,000: 12% reajuste");
      console.log("    • Sueldo > $500,000: 10% reajuste");
      console.log("\nPresiona Ctrl+C para detener el servidor");
      console.log("═════════════════════════════════════════════════════════\n");
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
    console.error("\n⚠️  Verifica que:");
    console.error("  1. MySQL esté ejecutándose");
    console.error("  2. Las credenciales en .env sean correctas");
    console.error("  3. La base de datos exista o pueda ser creada\n");
  }
};

iniciarServidor();
