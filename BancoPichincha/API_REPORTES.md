# API Endpoints - Consultas Avanzadas y Reportes

Esta guía muestra todos los endpoints disponibles para consultas avanzadas, búsquedas complejas y reportes del sistema Deuna.

## Base URL
```
http://localhost:3000/api
```

---

## 📊 BÚSQUEDAS CON FILTROS

### 1. Buscar Clientes con Filtros
```http
GET /api/reportes/clientes/buscar?nombre=Juan&activo=true
```

**Parámetros de Query:**
- `nombre`: Buscar por nombre (parcial)
- `cedula`: Buscar por cédula exacta
- `email`: Buscar por email (parcial)
- `codigoDeuna`: Buscar por código Deuna
- `activo`: true/false

**Ejemplo con cURL:**
```bash
curl "http://localhost:3000/api/reportes/clientes/buscar?nombre=Juan&activo=true"
```

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez García",
      "cedula": "1712345678",
      "email": "juan.perez@example.com",
      "codigoDeuna": "A1B2C3D4",
      "cuentas": [...]
    }
  ],
  "total": 1
}
```

---

### 2. Buscar Transacciones con Filtros
```http
GET /api/reportes/transacciones/buscar?tipo=TRANSFERENCIA&estado=CONFIRMADA&montoMin=50&montoMax=500
```

**Parámetros de Query:**
- `tipo`: RECARGA, TRANSFERENCIA, RETIRO, PAGO
- `estado`: PENDIENTE, CONFIRMADA, FALLIDA, REVERSADA
- `fechaInicio`: formato ISO (2026-01-01)
- `fechaFin`: formato ISO (2026-02-09)
- `montoMin`: monto mínimo
- `montoMax`: monto máximo
- `clienteId`: ID del cliente (busca en origen o destino)
- `limite`: número máximo de resultados (default: 50)

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/transacciones/buscar?tipo=TRANSFERENCIA&estado=CONFIRMADA&montoMin=100"
```

---

### 3. Buscar Cuentas con Filtros
```http
GET /api/reportes/cuentas/buscar?tipoCuenta=AHORROS&saldoMin=1000&activo=true
```

**Parámetros de Query:**
- `tipoCuenta`: AHORROS o CORRIENTE
- `saldoMin`: saldo mínimo
- `saldoMax`: saldo máximo
- `activo`: true/false

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/cuentas/buscar?saldoMin=1000&tipoCuenta=AHORROS"
```

---

## 🔗 CONSULTAS CON JOINS COMPLEJOS

### 4. Obtener Cliente Completo con Todas sus Relaciones
```http
GET /api/reportes/clientes/:id/completo
```

Obtiene cliente con:
- Todas sus cuentas
- Tarjetas de cada cuenta
- Vinculaciones Deuna
- Últimas 10 transacciones enviadas
- Últimas 10 transacciones recibidas

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/clientes/1/completo
```

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "nombre": "Juan Pérez García",
    "cuentas": [
      {
        "id": 1,
        "numeroCuenta": "1234567890",
        "saldo": 1500.50,
        "tarjetas": [...],
        "vinculacionesDeuna": [...]
      }
    ],
    "transaccionesEnviadas": [...],
    "transaccionesRecibidas": [...]
  }
}
```

---

### 5. Transacciones entre Dos Clientes
```http
GET /api/reportes/transacciones/entre/:id1/:id2
```

Obtiene todas las transacciones entre dos clientes específicos.

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/transacciones/entre/1/2
```

---

### 6. Cuentas con Vinculaciones Deuna
```http
GET /api/reportes/cuentas/vinculaciones
```

Obtiene todas las cuentas activas con sus vinculaciones Deuna.

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/cuentas/vinculaciones
```

---

## 🔍 BÚSQUEDAS AVANZADAS

### 7. Búsqueda Global
```http
GET /api/reportes/buscar/:termino
```

Busca el término en: nombre, cédula, email, usuario y código Deuna.

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/buscar/Juan
```

---

### 8. Buscar Transacciones por Texto
```http
GET /api/reportes/transacciones/buscar-texto/:texto
```

Busca en referencia y descripción de transacciones.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/transacciones/buscar-texto/Recarga"
```

---

## 📈 REPORTES Y ESTADÍSTICAS

### 9. Reporte de Transacciones por Cliente (Últimos 30 días)
```http
GET /api/reportes/clientes/:id/transacciones
```

Genera reporte completo con totales enviados, recibidos y comisiones.

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/clientes/1/transacciones
```

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "transacciones": [...],
    "resumen": {
      "totalTransacciones": 15,
      "totalEnviado": "1250.50",
      "totalRecibido": "2300.00",
      "totalComisiones": "35.50",
      "saldoNeto": "1049.50"
    }
  }
}
```

---

### 10. Top 10 Clientes Más Activos
```http
GET /api/reportes/top-clientes
```

Clientes ordenados por número de transacciones.

**Ejemplo:**
```bash
curl http://localhost:3000/api/reportes/top-clientes
```

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez García",
      "codigoDeuna": "A1B2C3D4",
      "total_transacciones": 25,
      "total_enviado": "3500.00",
      "total_recibido": "2800.00"
    },
    ...
  ]
}
```

---

### 11. Estadísticas por Período
```http
GET /api/reportes/estadisticas/periodo?fechaInicio=2026-01-01&fechaFin=2026-02-09
```

Estadísticas agrupadas por tipo de transacción y estado.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/estadisticas/periodo?fechaInicio=2026-01-01&fechaFin=2026-02-09"
```

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "tipoTransaccion": "RECARGA",
      "estado": "CONFIRMADA",
      "cantidad": 45,
      "monto_total": "12500.50",
      "comision_total": "62.50",
      "monto_promedio": "277.79"
    },
    {
      "tipoTransaccion": "TRANSFERENCIA",
      "estado": "CONFIRMADA",
      "cantidad": 120,
      "monto_total": "45000.00",
      "comision_total": "450.00",
      "monto_promedio": "375.00"
    }
  ]
}
```

---

### 12. Cuentas con Mayor Movimiento
```http
GET /api/reportes/cuentas/mayor-movimiento?limite=10
```

Top cuentas ordenadas por número de transacciones.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/cuentas/mayor-movimiento?limite=5"
```

**Respuesta:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "numeroCuenta": "1234567890",
      "tipoCuenta": "AHORROS",
      "saldo": "5500.75",
      "cliente_nombre": "Juan Pérez García",
      "total_transacciones": 35,
      "total_salidas": "8500.00",
      "total_entradas": "14000.75"
    },
    ...
  ]
}
```

---

### 13. Reporte de Comisiones Generadas
```http
GET /api/reportes/comisiones?fechaInicio=2026-01-01&fechaFin=2026-02-09
```

Reporte detallado de comisiones por día y tipo de transacción.

**Ejemplo:**
```bash
curl "http://localhost:3000/api/reportes/comisiones?fechaInicio=2026-01-01&fechaFin=2026-02-09"
```

**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "detalle": [
      {
        "fecha": "2026-02-09",
        "tipoTransaccion": "TRANSFERENCIA",
        "cantidad_transacciones": 15,
        "total_comisiones": "125.50",
        "comision_promedio": "8.37"
      },
      {
        "fecha": "2026-02-09",
        "tipoTransaccion": "RECARGA",
        "cantidad_transacciones": 8,
        "total_comisiones": "25.75",
        "comision_promedio": "3.22"
      }
    ],
    "totalComisiones": "151.25"
  }
}
```

---

## 📋 EJEMPLOS DE USO CON POSTMAN

### Colección Postman - Importar JSON

```json
{
  "info": {
    "name": "Banco Pichincha - Reportes Avanzados",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Buscar Clientes",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/reportes/clientes/buscar?nombre=Juan",
          "host": ["http://localhost:3000"],
          "path": ["api", "reportes", "clientes", "buscar"],
          "query": [
            {"key": "nombre", "value": "Juan"}
          ]
        }
      }
    },
    {
      "name": "Transacciones con Filtros",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/reportes/transacciones/buscar?tipo=TRANSFERENCIA&estado=CONFIRMADA",
          "host": ["http://localhost:3000"],
          "path": ["api", "reportes", "transacciones", "buscar"],
          "query": [
            {"key": "tipo", "value": "TRANSFERENCIA"},
            {"key": "estado", "value": "CONFIRMADA"}
          ]
        }
      }
    },
    {
      "name": "Top Clientes",
      "request": {
        "method": "GET",
        "header": [],
        "url": "http://localhost:3000/api/reportes/top-clientes"
      }
    }
  ]
}
```

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: Auditoría de Cliente
```bash
# 1. Obtener información completa del cliente
curl http://localhost:3000/api/reportes/clientes/1/completo

# 2. Ver reporte de transacciones
curl http://localhost:3000/api/reportes/clientes/1/transacciones
```

### Caso 2: Análisis de Actividad
```bash
# 1. Top clientes activos
curl http://localhost:3000/api/reportes/top-clientes

# 2. Cuentas con mayor movimiento
curl http://localhost:3000/api/reportes/cuentas/mayor-movimiento
```

### Caso 3: Reporte Financiero
```bash
# 1. Estadísticas del mes
curl "http://localhost:3000/api/reportes/estadisticas/periodo?fechaInicio=2026-02-01&fechaFin=2026-02-28"

# 2. Comisiones generadas
curl "http://localhost:3000/api/reportes/comisiones?fechaInicio=2026-02-01&fechaFin=2026-02-28"
```

### Caso 4: Búsqueda y Soporte
```bash
# 1. Búsqueda global por cualquier dato
curl http://localhost:3000/api/reportes/buscar/1712345678

# 2. Buscar transacción por referencia
curl http://localhost:3000/api/reportes/transacciones/buscar-texto/TRF-123
```

---

## ⚠️ Notas Importantes

1. **Paginación**: Usar parámetro `limite` para controlar resultados
2. **Fechas**: Usar formato ISO 8601 (YYYY-MM-DD)
3. **Performance**: Consultas complejas pueden ser lentas con muchos datos
4. **Cache**: Considerar implementar cache para reportes frecuentes
5. **Permisos**: En producción, agregar autenticación y autorización

---

## 🔧 Testing

### Verificar que el servidor está corriendo:
```bash
curl http://localhost:3000/api/clientes/estadisticas
```

### Ejecutar todas las consultas de prueba:
```bash
# Ver script test-reportes.sh en el repositorio
```
