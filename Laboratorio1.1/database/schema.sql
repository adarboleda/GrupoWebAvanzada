-- ============================================================
-- BASE DE DATOS: TIKI TAKA - SISTEMA DE VENTAS
-- Arquitectura MVC - Capa MODELO (Base de Datos)
-- ============================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS tiki_taka_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- Usar la base de datos
USE tiki_taka_db;

-- ============================================================
-- TABLA: ventas
-- Almacena todas las ventas realizadas en la tienda
-- ============================================================

DROP TABLE IF EXISTS ventas;

CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  monto DECIMAL(10, 2) NOT NULL,
  tipo CHAR(1) NOT NULL CHECK (tipo IN ('A', 'B', 'C')),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DESCRIPCIÓN DE LOS CAMPOS:
-- ============================================================
-- id: Identificador único de cada venta (auto-incremental)
-- monto: Monto de la venta en formato decimal (ej: 1250.50)
-- tipo: Clasificación de la venta
--       'A' = Mayor a $1000
--       'B' = Mayor a $500 pero menor o igual a $1000
--       'C' = Menor o igual a $500
-- fecha: Fecha y hora de registro de la venta
-- ============================================================

-- Insertar datos de prueba (opcional)
INSERT INTO ventas (monto, tipo) VALUES 
(1500.00, 'A'),
(750.50, 'B'),
(450.00, 'C'),
(1200.00, 'A'),
(600.00, 'B'),
(300.00, 'C'),
(2000.00, 'A'),
(500.00, 'C');

-- ============================================================
-- CONSULTAS ÚTILES
-- ============================================================

-- Ver todas las ventas
-- SELECT * FROM ventas ORDER BY fecha DESC;

-- Estadísticas de ventas
-- SELECT 
--   COUNT(*) as total_ventas,
--   SUM(CASE WHEN tipo = 'A' THEN 1 ELSE 0 END) as ventas_tipo_a,
--   SUM(CASE WHEN tipo = 'B' THEN 1 ELSE 0 END) as ventas_tipo_b,
--   SUM(CASE WHEN tipo = 'C' THEN 1 ELSE 0 END) as ventas_tipo_c,
--   SUM(CASE WHEN tipo = 'A' THEN monto ELSE 0 END) as total_tipo_a,
--   SUM(CASE WHEN tipo = 'B' THEN monto ELSE 0 END) as total_tipo_b,
--   SUM(CASE WHEN tipo = 'C' THEN monto ELSE 0 END) as total_tipo_c,
--   SUM(monto) as total_general
-- FROM ventas;

-- Ventas por tipo
-- SELECT * FROM ventas WHERE tipo = 'A' ORDER BY monto DESC;

-- Limpiar todas las ventas
-- DELETE FROM ventas;

-- ============================================================
-- INSTRUCCIONES DE USO:
-- ============================================================
-- 1. Asegúrate de que XAMPP esté ejecutándose
-- 2. Abre phpMyAdmin (http://localhost/phpmyadmin)
-- 3. Ve a la pestaña SQL
-- 4. Copia y pega este script completo
-- 5. Haz clic en "Ejecutar" o "Go"
-- ============================================================
