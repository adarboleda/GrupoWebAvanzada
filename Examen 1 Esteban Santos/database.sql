-- ========================================
-- BASE DE DATOS: Reajuste de Sueldos
-- Ejercicio 2 - Esteban Santos
-- ========================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS cuotas_seguros 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- Usar la base de datos
USE cuotas_seguros;

-- Crear la tabla de empleados
-- NOTA: Sequelize creará esta tabla automáticamente,
-- pero este script está disponible si prefieres crearla manualmente

CREATE TABLE IF NOT EXISTS empleados (
  id INT NOT NULL AUTO_INCREMENT,
  nombreEmpleado VARCHAR(100) NOT NULL,
  antiguedad INT NOT NULL,
  sueldoActual DECIMAL(10,2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar datos de prueba (opcional)
INSERT INTO empleados (nombreEmpleado, antiguedad, sueldoActual, createdAt, updatedAt) VALUES
('Juan Pérez', 5, 250000.00, NOW(), NOW()),
('Ana López', 8, 350000.00, NOW(), NOW()),
('Carlos Gómez', 12, 280000.00, NOW(), NOW()),
('María Rodríguez', 15, 450000.00, NOW(), NOW()),
('Laura Sánchez', 3, 520000.00, NOW(), NOW()),
('Diego Fernández', 18, 320000.00, NOW(), NOW()),
('Roberto Castro', 10, 300000.00, NOW(), NOW()),
('Sofia Ramírez', 20, 600000.00, NOW(), NOW());

-- Verificar los datos
SELECT * FROM empleados;

-- ========================================
-- REGLAS DE NEGOCIO (Ejercicio 2):
-- ========================================
-- Hasta 10 años de antigüedad (incluyendo 10):
--   • Sueldo actual hasta $300,000: 12% de reajuste
--   • Sueldo actual más de $300,000 y hasta $500,000: 10% de reajuste
--   • Sueldo actual superior a $500,000: 8% de reajuste
--
-- Más de 10 años hasta 20 años (incluyendo 20):
--   • Sueldo actual hasta $300,000: 14% de reajuste
--   • Sueldo actual más de $300,000 y hasta $500,000: 12% de reajuste
--   • Sueldo actual más de $500,000: 10% de reajuste
-- ========================================

-- Ejemplos de cálculos:
-- Juan Pérez (5 años, $250,000):     12% → Reajuste: $30,000    → Nuevo: $280,000
-- Ana López (8 años, $350,000):      10% → Reajuste: $35,000    → Nuevo: $385,000
-- Carlos Gómez (12 años, $280,000):  14% → Reajuste: $39,200    → Nuevo: $319,200
-- María Rodríguez (15 años, $450,000): 12% → Reajuste: $54,000  → Nuevo: $504,000
-- Laura Sánchez (3 años, $520,000):  8%  → Reajuste: $41,600    → Nuevo: $561,600
-- Diego Fernández (18 años, $320,000): 12% → Reajuste: $38,400  → Nuevo: $358,400
-- Empleado límite (10 años, $300,000): 12% → Reajuste: $36,000  → Nuevo: $336,000
-- Empleado límite (20 años, $600,000): 10% → Reajuste: $60,000  → Nuevo: $660,000
