// Índice de modelos - Sistema de Gestión de Equipos y Jugadores
import sequelize from "../config/database.js";

// Importar modelos
import Equipo from "./equipo.js";
import Jugador from "./jugador.js";

// ============================================
// DEFINIR RELACIONES ENTRE MODELOS
// ============================================

// Equipo - Jugador (1:N)
Equipo.hasMany(Jugador, {
  foreignKey: 'equipoId',
  as: 'jugadores'
});
Jugador.belongsTo(Equipo, {
  foreignKey: 'equipoId',
  as: 'equipo'
});

// ============================================
// EXPORTAR MODELOS Y SEQUELIZE
// ============================================

export { sequelize, Equipo, Jugador };

export default { sequelize, Equipo, Jugador };
