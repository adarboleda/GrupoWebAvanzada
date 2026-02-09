-- =====================================================
-- BANCO PICHINCHA - SISTEMA DEUNA
-- Base de Datos MySQL - Estructura Completa
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS banco_deuna CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banco_deuna;

-- =====================================================
-- TABLA: clientes
-- Descripción: Almacena información de clientes del banco
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre completo del cliente',
    cedula VARCHAR(10) NOT NULL UNIQUE COMMENT 'Cédula de identidad ecuatoriana',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico',
    telefono VARCHAR(20) NULL COMMENT 'Número de teléfono',
    usuario VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario para login',
    password VARCHAR(100) NOT NULL COMMENT 'Contraseña (en producción usar hash)',
    codigoDeuna VARCHAR(8) NOT NULL UNIQUE COMMENT 'Código único para recibir transferencias Deuna',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado de la cuenta del cliente',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_usuario (usuario),
    INDEX idx_codigo_deuna (codigoDeuna),
    INDEX idx_cedula (cedula)
) ENGINE=InnoDB COMMENT='Clientes del banco';

-- =====================================================
-- TABLA: cuentas
-- Descripción: Cuentas bancarias de clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS cuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL COMMENT 'ID del cliente propietario',
    numeroCuenta VARCHAR(20) NOT NULL UNIQUE COMMENT 'Número único de cuenta',
    tipoCuenta ENUM('AHORROS', 'CORRIENTE') NOT NULL DEFAULT 'AHORROS' COMMENT 'Tipo de cuenta bancaria',
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Saldo disponible en la cuenta',
    moneda VARCHAR(3) NOT NULL DEFAULT 'USD' COMMENT 'Moneda de la cuenta',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado de la cuenta',
    limiteTransferencia DECIMAL(15, 2) NOT NULL DEFAULT 5000.00 COMMENT 'Límite diario de transferencias',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_cliente (clienteId),
    INDEX idx_numero_cuenta (numeroCuenta),
    
    CONSTRAINT chk_saldo_positivo CHECK (saldo >= 0)
) ENGINE=InnoDB COMMENT='Cuentas bancarias';

-- =====================================================
-- TABLA: tarjetas
-- Descripción: Tarjetas de débito y crédito
-- =====================================================
CREATE TABLE IF NOT EXISTS tarjetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL COMMENT 'ID del cliente propietario',
    cuentaId INT NULL COMMENT 'ID de cuenta asociada',
    numeroTarjeta VARCHAR(16) NOT NULL UNIQUE COMMENT 'Número de tarjeta',
    tipoTarjeta ENUM('DEBITO', 'CREDITO') NOT NULL COMMENT 'Tipo de tarjeta',
    marca ENUM('VISA', 'MASTERCARD', 'AMERICAN_EXPRESS') NOT NULL DEFAULT 'VISA' COMMENT 'Marca de la tarjeta',
    cvv VARCHAR(4) NOT NULL COMMENT 'Código de seguridad',
    fechaExpiracion DATE NOT NULL COMMENT 'Fecha de expiración',
    limiteCredito DECIMAL(15, 2) NULL COMMENT 'Límite de crédito (solo tarjetas CREDITO)',
    saldoDisponible DECIMAL(15, 2) NULL COMMENT 'Saldo disponible (solo tarjetas CREDITO)',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado de la tarjeta',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (cuentaId) REFERENCES cuentas(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_cliente (clienteId),
    INDEX idx_cuenta (cuentaId),
    INDEX idx_numero_tarjeta (numeroTarjeta)
) ENGINE=InnoDB COMMENT='Tarjetas de débito y crédito';

-- =====================================================
-- TABLA: transacciones
-- Descripción: Registro de todas las transacciones
-- =====================================================
CREATE TABLE IF NOT EXISTS transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoTransaccion ENUM('RECARGA', 'TRANSFERENCIA', 'RETIRO', 'PAGO') NOT NULL COMMENT 'Tipo de transacción',
    origenId INT NULL COMMENT 'Cliente que realiza la transacción',
    destinoId INT NULL COMMENT 'Cliente que recibe la transacción',
    cuentaOrigenId INT NULL COMMENT 'Cuenta origen',
    cuentaDestinoId INT NULL COMMENT 'Cuenta destino',
    monto DECIMAL(15, 2) NOT NULL COMMENT 'Monto de la transacción',
    comision DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Comisión aplicada',
    montoTotal DECIMAL(15, 2) NOT NULL COMMENT 'Monto total (monto + comisión)',
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'FALLIDA', 'REVERSADA') NOT NULL DEFAULT 'PENDIENTE' COMMENT 'Estado de la transacción',
    descripcion VARCHAR(255) NULL COMMENT 'Descripción de la transacción',
    referencia VARCHAR(100) NULL UNIQUE COMMENT 'Referencia única de la transacción',
    codigoQR TEXT NULL COMMENT 'Código QR para el pago',
    fechaExpiracion DATETIME NULL COMMENT 'Fecha de expiración para solicitudes de cobro',
    ipOrigen VARCHAR(45) NULL COMMENT 'Dirección IP de origen',
    navegador VARCHAR(255) NULL COMMENT 'Navegador utilizado',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (origenId) REFERENCES clientes(id),
    FOREIGN KEY (destinoId) REFERENCES clientes(id),
    FOREIGN KEY (cuentaOrigenId) REFERENCES cuentas(id),
    FOREIGN KEY (cuentaDestinoId) REFERENCES cuentas(id),
    
    INDEX idx_origen (origenId),
    INDEX idx_destino (destinoId),
    INDEX idx_cuenta_origen (cuentaOrigenId),
    INDEX idx_cuenta_destino (cuentaDestinoId),
    INDEX idx_referencia (referencia),
    INDEX idx_estado (estado),
    INDEX idx_fecha (createdAt),
    
    CONSTRAINT chk_monto_positivo CHECK (monto > 0)
) ENGINE=InnoDB COMMENT='Historial de transacciones';

-- =====================================================
-- TABLA: vinculaciones_deuna
-- Descripción: Vinculación de cuentas con sistema Deuna
-- =====================================================
CREATE TABLE IF NOT EXISTS vinculaciones_deuna (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clienteId INT NOT NULL COMMENT 'ID del cliente',
    cuentaId INT NOT NULL COMMENT 'ID de la cuenta vinculada',
    alias VARCHAR(50) NULL UNIQUE COMMENT 'Alias personalizado para pago rápido',
    numeroIdentificacion VARCHAR(20) NULL UNIQUE COMMENT 'Número de identificación de pago rápido',
    token VARCHAR(100) NULL UNIQUE COMMENT 'Token de vinculación',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado de la vinculación',
    esPrincipal BOOLEAN DEFAULT FALSE COMMENT 'Indica si es la cuenta principal para Deuna',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (cuentaId) REFERENCES cuentas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_cliente (clienteId),
    INDEX idx_cuenta (cuentaId),
    INDEX idx_alias (alias),
    INDEX idx_token (token)
) ENGINE=InnoDB COMMENT='Vinculaciones con sistema Deuna';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de saldos por cliente
CREATE OR REPLACE VIEW vista_saldos_cliente AS
SELECT 
    c.id,
    c.nombre,
    c.usuario,
    c.codigoDeuna,
    COUNT(DISTINCT cta.id) as total_cuentas,
    SUM(cta.saldo) as saldo_total,
    c.activo
FROM clientes c
LEFT JOIN cuentas cta ON c.id = cta.clienteId AND cta.activo = TRUE
GROUP BY c.id, c.nombre, c.usuario, c.codigoDeuna, c.activo;

-- Vista de transacciones detalladas
CREATE OR REPLACE VIEW vista_transacciones_detalladas AS
SELECT 
    t.id,
    t.referencia,
    t.tipoTransaccion,
    origen.nombre as cliente_origen,
    destino.nombre as cliente_destino,
    t.monto,
    t.comision,
    t.montoTotal,
    t.estado,
    t.descripcion,
    t.createdAt as fecha
FROM transacciones t
LEFT JOIN clientes origen ON t.origenId = origen.id
LEFT JOIN clientes destino ON t.destinoId = destino.id
ORDER BY t.createdAt DESC;

-- Vista de cuentas con cliente
CREATE OR REPLACE VIEW vista_cuentas_completa AS
SELECT 
    cta.id,
    cta.numeroCuenta,
    cta.tipoCuenta,
    cta.saldo,
    cta.limiteTransferencia,
    c.id as clienteId,
    c.nombre as clienteNombre,
    c.cedula,
    c.codigoDeuna,
    cta.activo
FROM cuentas cta
INNER JOIN clientes c ON cta.clienteId = c.id;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

DELIMITER //

-- Procedimiento para obtener estadísticas generales
CREATE PROCEDURE sp_estadisticas_generales()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM clientes WHERE activo = TRUE) as total_clientes,
        (SELECT COALESCE(SUM(saldo), 0) FROM cuentas WHERE activo = TRUE) as saldo_total_sistema,
        (SELECT COUNT(*) FROM transacciones WHERE DATE(createdAt) = CURDATE()) as transacciones_hoy,
        (SELECT COUNT(*) FROM transacciones) as total_transacciones,
        (SELECT COUNT(*) FROM cuentas WHERE activo = TRUE) as total_cuentas_activas,
        (SELECT COUNT(*) FROM tarjetas WHERE activo = TRUE) as total_tarjetas_activas;
END //

-- Procedimiento para obtener historial de un cliente
CREATE PROCEDURE sp_historial_cliente(IN p_clienteId INT)
BEGIN
    SELECT 
        t.id,
        t.referencia,
        t.tipoTransaccion,
        t.monto,
        t.comision,
        t.montoTotal,
        t.estado,
        t.descripcion,
        t.createdAt,
        origen.nombre as origen_nombre,
        destino.nombre as destino_nombre
    FROM transacciones t
    LEFT JOIN clientes origen ON t.origenId = origen.id
    LEFT JOIN clientes destino ON t.destinoId = destino.id
    WHERE t.origenId = p_clienteId OR t.destinoId = p_clienteId
    ORDER BY t.createdAt DESC
    LIMIT 50;
END //

DELIMITER ;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Ejecutar con: npm run seed
-- El archivo seeds.js creará 10 clientes, múltiples cuentas,
-- tarjetas y transacciones de ejemplo

-- =====================================================
-- CONSULTAS ÚTILES
-- =====================================================

-- Obtener cliente con todas sus cuentas
-- SELECT c.*, cta.* FROM clientes c 
-- LEFT JOIN cuentas cta ON c.id = cta.clienteId 
-- WHERE c.id = 1;

-- Obtener transacciones de un cliente
-- SELECT * FROM vista_transacciones_detalladas 
-- WHERE cliente_origen = 'Juan Pérez García' 
-- OR cliente_destino = 'Juan Pérez García';

-- Obtener saldo total por tipo de cuenta
-- SELECT tipoCuenta, COUNT(*) as total, SUM(saldo) as saldo_total 
-- FROM cuentas WHERE activo = TRUE 
-- GROUP BY tipoCuenta;

-- Estadísticas de transacciones por estado
-- SELECT estado, COUNT(*) as total, SUM(monto) as monto_total 
-- FROM transacciones 
-- GROUP BY estado;
