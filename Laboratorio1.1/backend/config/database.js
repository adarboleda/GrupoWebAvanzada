/**
 * MODELO - Configuración de la base de datos MySQL
 * Establece la conexión con MySQL usando XAMPP
 */

const mysql = require("mysql2");
require("dotenv").config();

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tiki_taka_db",
  port: process.env.DB_PORT || 3096,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Usar promesas para async/await
const promisePool = pool.promise();

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    console.error("Asegúrate de que XAMPP MySQL esté ejecutándose");
    return;
  }
  console.log("✅ Conexión exitosa a MySQL (XAMPP)");
  connection.release();
});

module.exports = promisePool;
