-- Script de base de datos para Sistema de Gestión de Equipos y Jugadores

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestion_equipos_jugadores;
USE gestion_equipos_jugadores;

-- Tabla de Equipos
CREATE TABLE IF NOT EXISTS equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Jugadores
CREATE TABLE IF NOT EXISTS jugadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  posicion VARCHAR(50) NOT NULL,
  numero INT NOT NULL,
  equipoId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (equipoId) REFERENCES equipos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_numero_equipo (equipoId, numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de prueba
INSERT INTO equipos (nombre, ciudad) VALUES
('Barcelona', 'Barcelona'),
('Real Madrid', 'Madrid'),
('Atlético Madrid', 'Madrid'),
('Valencia', 'Valencia'),
('Sevilla', 'Sevilla');

INSERT INTO jugadores (nombre, posicion, numero, equipoId) VALUES
('Messi', 'Delantero', 10, 1),
('Busquets', 'Centrocampista', 5, 1),
('Piqué', 'Defensa', 3, 1),
('Benzema', 'Delantero', 9, 2),
('Modric', 'Centrocampista', 19, 2),
('Ramos', 'Defensa', 4, 2),
('Suárez', 'Delantero', 9, 3),
('Koke', 'Centrocampista', 6, 3),
('Oblak', 'Portero', 1, 3);
