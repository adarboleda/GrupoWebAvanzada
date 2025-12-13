-- =============================================
-- SCRIPT SQL COMPLETO - Sistema de Seguros Vehiculares
-- =============================================

-- 1. Crear la base de datos (si no existe) y seleccionarla
CREATE DATABASE IF NOT EXISTS SegurosVehiculares;
USE SegurosVehiculares;

-- 2. Tabla CONDUCTOR
-- Almacena datos para validar edad (reglas 18-75 años) e historial (accidentes)
CREATE TABLE IF NOT EXISTS Conductor (
    id_conductor INT AUTO_INCREMENT PRIMARY KEY,
    identificacion VARCHAR(20) NOT NULL UNIQUE COMMENT 'Cedula o Pasaporte',
    nombre_completo VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL COMMENT 'Vital para calcular edad y aplicar recargos o rechazos',
    email VARCHAR(100),
    numero_accidentes INT DEFAULT 0 COMMENT '0=Descuento, >0=Recargo, >3=Rechazo/Recargo Alto',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabla VEHICULO
-- Almacena datos para validar antigüedad (>20 años) y tipo (Sedán vs SUV)
CREATE TABLE IF NOT EXISTS Vehiculo (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio_fabricacion INT NOT NULL COMMENT 'Si (Año Actual - Año Fab) > 20, no se cotiza',
    placa VARCHAR(20) UNIQUE,
    valor_mercado DECIMAL(10, 2) NOT NULL COMMENT 'Influye directamente en el costo final',
    tipo_vehiculo ENUM('SEDAN', 'SUV', 'CAMIONETA', 'OTRO') NOT NULL COMMENT 'Define el costo base',
    uso_vehiculo ENUM('PERSONAL', 'COMERCIAL') NOT NULL COMMENT 'Comercial tiene recargo obligatorio'
) ENGINE=InnoDB;

-- 4. Tabla COTIZACION
-- Tabla central que une conductor y vehiculo. Maneja estados y vigencia.
CREATE TABLE IF NOT EXISTS Cotizacion (
    id_cotizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_conductor INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME NOT NULL COMMENT 'Vigencia maxima (ej. 30 dias)',
    
    -- Desglose de costos
    monto_base DECIMAL(10, 2) NOT NULL,
    monto_recargos DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Por edad, uso comercial o accidentes',
    monto_descuentos DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Por buen historial o pago anual',
    monto_total DECIMAL(10, 2) NOT NULL,
    
    -- Estados y validaciones
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'VENCIDA') DEFAULT 'PENDIENTE',
    mensaje_rechazo VARCHAR(255) NULL COMMENT 'Explica por qué se rechazó (ej. "Conductor menor de edad")',
    acepta_terminos TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Si, 0 = No',
    
    -- Definición de claves foráneas
    FOREIGN KEY (id_conductor) REFERENCES Conductor(id_conductor) ON DELETE CASCADE,
    FOREIGN KEY (id_vehiculo) REFERENCES Vehiculo(id_vehiculo) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabla PAGO
-- Maneja la transacción financiera y reglas de tarjetas/cuotas
CREATE TABLE IF NOT EXISTS Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cotizacion INT NOT NULL,
    
    tipo_tarjeta ENUM('CREDITO', 'DEBITO') NOT NULL,
    modalidad_pago ENUM('CONTADO', 'DIFERIDO') NOT NULL COMMENT 'Contado puede tener descuento',
    numero_cuotas INT DEFAULT 1 COMMENT 'Si > 1 incrementa valor total',
    
    monto_pagado DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_transaccion ENUM('EXITOSO', 'FALLIDO', 'PENDIENTE') NOT NULL,
    codigo_referencia_pasarela VARCHAR(100) NULL COMMENT 'ID de transacción del banco',
    
    FOREIGN KEY (id_cotizacion) REFERENCES Cotizacion(id_cotizacion) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. Tabla USUARIO
-- Maneja la autenticación y autorización del sistema
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario para login',
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada con bcrypt',
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol ENUM('ADMIN', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR' COMMENT 'ADMIN = Control total, OPERADOR = Solo operaciones',
    activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Inactivo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Limpiar datos existentes (opcional, solo para pruebas)
-- DELETE FROM Pago;
-- DELETE FROM Cotizacion;
-- DELETE FROM Vehiculo;
-- DELETE FROM Conductor;

-- Insertar Conductores de Prueba
INSERT INTO Conductor (identificacion, nombre_completo, fecha_nacimiento, numero_accidentes, email)
VALUES 
-- Casos válidos
('1717171717', 'Abner Arboleda', '1995-05-15', 0, 'abner@ejemplo.com'),           -- 29 años, sin accidentes (riesgo estándar)
('0987654321', 'María González', '2001-08-20', 1, 'maria@ejemplo.com'),           -- 23 años, 1 accidente (conductor joven)
('1122334455', 'Carlos Ramírez', '1980-03-10', 0, 'carlos@ejemplo.com'),          -- 44 años, sin accidentes (riesgo estándar)
('2233445566', 'Ana Martínez', '1957-11-25', 2, 'ana@ejemplo.com'),              -- 67 años, 2 accidentes (mayor 65)
('3344556677', 'Luis Torres', '1990-06-30', 4, 'luis@ejemplo.com'),              -- 34 años, 4 accidentes (alto riesgo)

-- Casos extremos (para probar validaciones)
('9999999999', 'Pedro Menor', '2008-01-01', 0, 'pedro@ejemplo.com'),             -- 16 años (será rechazado)
('8888888888', 'Rosa Mayor', '1945-07-15', 0, 'rosa@ejemplo.com');               -- 79 años (será rechazado)

-- Insertar Vehículos de Prueba
INSERT INTO Vehiculo (marca, modelo, anio_fabricacion, placa, valor_mercado, tipo_vehiculo, uso_vehiculo)
VALUES 
-- Vehículos válidos
('Toyota', 'Fortuner', 2022, 'PBA-1234', 45000.00, 'SUV', 'PERSONAL'),           -- SUV reciente, uso personal
('Chevrolet', 'Sail', 2020, 'PIC-5678', 15000.00, 'SEDAN', 'PERSONAL'),          -- Sedán reciente, uso personal
('Nissan', 'Navara', 2019, 'GUA-9012', 35000.00, 'CAMIONETA', 'COMERCIAL'),      -- Camioneta, uso comercial
('Mazda', 'CX-5', 2021, 'QUI-3456', 28000.00, 'SUV', 'PERSONAL'),                -- SUV reciente
('Hyundai', 'Accent', 2018, 'AZU-7890', 12000.00, 'SEDAN', 'PERSONAL'),          -- Sedán uso personal

-- Vehículos antiguos (para probar validaciones)
('Chevrolet', 'Aveo', 2000, 'OLD-0001', 3000.00, 'SEDAN', 'PERSONAL'),           -- 25 años (será rechazado)
('Ford', 'Explorer', 1998, 'OLD-0002', 2500.00, 'SUV', 'PERSONAL');              -- 27 años (será rechazado)

-- =============================================
-- EJEMPLOS DE CONSULTAS ÚTILES
-- =============================================

-- Ver todos los conductores con su edad calculada
SELECT 
    id_conductor,
    nombre_completo,
    fecha_nacimiento,
    TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) as edad,
    numero_accidentes,
    email
FROM Conductor
ORDER BY fecha_nacimiento DESC;

-- Ver todos los vehículos con su antigüedad
SELECT 
    id_vehiculo,
    CONCAT(marca, ' ', modelo) as vehiculo,
    anio_fabricacion,
    YEAR(CURDATE()) - anio_fabricacion as antiguedad,
    placa,
    valor_mercado,
    tipo_vehiculo,
    uso_vehiculo,
    CASE 
        WHEN (YEAR(CURDATE()) - anio_fabricacion) > 20 THEN 'NO COTIZABLE'
        ELSE 'COTIZABLE'
    END as estado_cotizacion
FROM Vehiculo
ORDER BY anio_fabricacion DESC;

-- Ver conductores aptos para cotización (18-75 años)
SELECT 
    id_conductor,
    nombre_completo,
    TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) as edad,
    numero_accidentes,
    CASE
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18 THEN 'MENOR DE EDAD'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 18 AND 24 THEN 'CONDUCTOR JOVEN (Recargo 25%)'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 25 AND 65 THEN 'RIESGO ESTÁNDAR'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 75 THEN 'MAYOR 75 (Rechazado)'
        ELSE 'MAYOR 65 (Recargo 15%)'
    END as categoria_riesgo
FROM Conductor
ORDER BY edad;

-- Ver todas las cotizaciones con información completa
SELECT 
    c.id_cotizacion,
    cond.nombre_completo as conductor,
    CONCAT(v.marca, ' ', v.modelo) as vehiculo,
    c.monto_base,
    c.monto_recargos,
    c.monto_descuentos,
    c.monto_total,
    c.estado,
    c.fecha_creacion,
    c.fecha_vencimiento,
    CASE 
        WHEN c.fecha_vencimiento < NOW() THEN 'VENCIDA'
        ELSE 'VIGENTE'
    END as vigencia
FROM Cotizacion c
INNER JOIN Conductor cond ON c.id_conductor = cond.id_conductor
INNER JOIN Vehiculo v ON c.id_vehiculo = v.id_vehiculo
ORDER BY c.fecha_creacion DESC;

-- Ver todos los pagos con información de cotización
SELECT 
    p.id_pago,
    p.tipo_tarjeta,
    p.modalidad_pago,
    p.numero_cuotas,
    p.monto_pagado,
    p.estado_transaccion,
    p.fecha_pago,
    cond.nombre_completo as conductor,
    CONCAT(v.marca, ' ', v.modelo) as vehiculo,
    c.monto_total as monto_cotizacion
FROM Pago p
INNER JOIN Cotizacion c ON p.id_cotizacion = c.id_cotizacion
INNER JOIN Conductor cond ON c.id_conductor = cond.id_conductor
INNER JOIN Vehiculo v ON c.id_vehiculo = v.id_vehiculo
ORDER BY p.fecha_pago DESC;

-- Estadísticas de cotizaciones
SELECT 
    estado,
    COUNT(*) as cantidad,
    SUM(monto_total) as monto_total_acumulado,
    AVG(monto_total) as promedio_monto
FROM Cotizacion
GROUP BY estado;

-- Estadísticas de pagos
SELECT 
    estado_transaccion,
    COUNT(*) as cantidad_transacciones,
    SUM(monto_pagado) as total_recaudado,
    tipo_tarjeta,
    modalidad_pago
FROM Pago
GROUP BY estado_transaccion, tipo_tarjeta, modalidad_pago;
