// Script para sincronizar la base de datos - Sistema de Cotización con tablas separadas
import { sequelize } from "./models/index.js";

const sincronizarDB = async () => {
  try {
    console.log("Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
    
    console.log("Creando tablas (force: true - elimina y recrea)...");
    await sequelize.sync({ force: true });
    
    console.log("✅ Tablas creadas exitosamente!");
    console.log("\nTablas creadas:");
    console.log("- conductores");
    console.log("- vehiculos");
    console.log("- historial_accidentes");
    console.log("- formas_pago");
    console.log("- cotizaciones");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
    process.exit(1);
  }
};

sincronizarDB();
