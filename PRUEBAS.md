# 🧪 Pruebas del Sistema - Comandos de Verificación

## Pruebas del Backend (API REST)

### 1. Verificar que el servidor está corriendo

```powershell
# Debe retornar información de la API
curl http://localhost:3000
```

**Respuesta esperada:**
```json
{
  "message": "API de Tiki Taka - Sistema de Ventas MVC",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### 2. Crear una venta (Tipo A - Mayor a $1000)

```powershell
curl -X POST http://localhost:3000/api/ventas `
  -H "Content-Type: application/json" `
  -d '{\"monto\": 1500}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "data": {
    "id": 1,
    "monto": 1500,
    "tipo": "A",
    "success": true
  }
}
```

### 3. Crear una venta (Tipo B - Entre $500 y $1000)

```powershell
curl -X POST http://localhost:3000/api/ventas `
  -H "Content-Type: application/json" `
  -d '{\"monto\": 750}'
```

### 4. Crear una venta (Tipo C - Menor o igual a $500)

```powershell
curl -X POST http://localhost:3000/api/ventas `
  -H "Content-Type: application/json" `
  -d '{\"monto\": 450}'
```

### 5. Obtener todas las ventas

```powershell
curl http://localhost:3000/api/ventas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "monto": "1500.00",
      "tipo": "A",
      "fecha": "2025-10-25T..."
    },
    ...
  ]
}
```

### 6. Obtener estadísticas

```powershell
curl http://localhost:3000/api/ventas/estadisticas
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "total_ventas": 3,
    "ventas_tipo_a": 1,
    "ventas_tipo_b": 1,
    "ventas_tipo_c": 1,
    "total_tipo_a": "1500.00",
    "total_tipo_b": "750.00",
    "total_tipo_c": "450.00",
    "total_general": "2700.00"
  }
}
```

### 7. Obtener ventas por tipo

```powershell
# Tipo A
curl http://localhost:3000/api/ventas/tipo/A

# Tipo B
curl http://localhost:3000/api/ventas/tipo/B

# Tipo C
curl http://localhost:3000/api/ventas/tipo/C
```

### 8. Eliminar todas las ventas

```powershell
curl -X DELETE http://localhost:3000/api/ventas
```

---

## Pruebas con PowerShell (Invoke-WebRequest)

### Crear venta

```powershell
$body = @{
    monto = 1500
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/ventas" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Obtener estadísticas

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/ventas/estadisticas" `
  -Method GET | Select-Object -ExpandProperty Content
```

---

## Pruebas de la Base de Datos (MySQL)

### Desde phpMyAdmin (http://localhost/phpmyadmin)

```sql
-- Ver todas las ventas
SELECT * FROM ventas ORDER BY fecha DESC;

-- Estadísticas por tipo
SELECT 
    tipo,
    COUNT(*) as cantidad,
    SUM(monto) as total
FROM ventas
GROUP BY tipo;

-- Total general
SELECT 
    COUNT(*) as total_ventas,
    SUM(monto) as total_general
FROM ventas;

-- Ventas del día de hoy
SELECT * FROM ventas 
WHERE DATE(fecha) = CURDATE()
ORDER BY fecha DESC;

-- Eliminar todas las ventas
DELETE FROM ventas;

-- Reiniciar auto-increment
ALTER TABLE ventas AUTO_INCREMENT = 1;
```

---

## Pruebas del Frontend

### Pruebas Manuales en el Navegador

1. **Abrir aplicación:** http://localhost:3001

2. **Registrar venta Tipo A:**
   - Ingresar monto: `1500`
   - Click "Registrar Venta"
   - ✅ Debe mostrar: "✅ Venta registrada: $1500 - Tipo A"

3. **Registrar venta Tipo B:**
   - Ingresar monto: `750`
   - Click "Registrar Venta"
   - ✅ Debe mostrar: "✅ Venta registrada: $750 - Tipo B"

4. **Registrar venta Tipo C:**
   - Ingresar monto: `450`
   - Click "Registrar Venta"
   - ✅ Debe mostrar: "✅ Venta registrada: $450 - Tipo C"

5. **Verificar estadísticas:**
   - ✅ Total General: 3 ventas - $2700
   - ✅ Tipo A: 1 venta - $1500
   - ✅ Tipo B: 1 venta - $750
   - ✅ Tipo C: 1 venta - $450

6. **Verificar tabla:**
   - ✅ Debe mostrar 3 filas
   - ✅ Badges de colores por tipo
   - ✅ Fechas y montos correctos

7. **Limpiar datos:**
   - Click "🗑️ Limpiar Todas"
   - Confirmar
   - ✅ Tabla vacía
   - ✅ Estadísticas en cero

---

## Script de Prueba Automatizada (PowerShell)

```powershell
# Guardar como: test-sistema.ps1

Write-Host "🧪 Iniciando pruebas del sistema..." -ForegroundColor Cyan

# Test 1: Servidor corriendo
Write-Host "`n1️⃣ Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    Write-Host "✅ Servidor OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor no responde" -ForegroundColor Red
    exit
}

# Test 2: Crear ventas de prueba
Write-Host "`n2️⃣ Creando ventas de prueba..." -ForegroundColor Yellow

# Venta Tipo A
$ventaA = @{ monto = 1500 } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ventas" `
    -Method POST -ContentType "application/json" -Body $ventaA
Write-Host "✅ Venta Tipo A creada" -ForegroundColor Green

# Venta Tipo B
$ventaB = @{ monto = 750 } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ventas" `
    -Method POST -ContentType "application/json" -Body $ventaB
Write-Host "✅ Venta Tipo B creada" -ForegroundColor Green

# Venta Tipo C
$ventaC = @{ monto = 450 } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ventas" `
    -Method POST -ContentType "application/json" -Body $ventaC
Write-Host "✅ Venta Tipo C creada" -ForegroundColor Green

# Test 3: Verificar estadísticas
Write-Host "`n3️⃣ Verificando estadísticas..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/ventas/estadisticas" -Method GET
$stats = ($response.Content | ConvertFrom-Json).data

Write-Host "📊 Total ventas: $($stats.total_ventas)" -ForegroundColor Cyan
Write-Host "📊 Ventas Tipo A: $($stats.ventas_tipo_a) - Total: $($stats.total_tipo_a)" -ForegroundColor Cyan
Write-Host "📊 Ventas Tipo B: $($stats.ventas_tipo_b) - Total: $($stats.total_tipo_b)" -ForegroundColor Cyan
Write-Host "📊 Ventas Tipo C: $($stats.ventas_tipo_c) - Total: $($stats.total_tipo_c)" -ForegroundColor Cyan
Write-Host "📊 Total general: $($stats.total_general)" -ForegroundColor Cyan

if ($stats.total_ventas -eq 3 -and $stats.total_general -eq 2700) {
    Write-Host "`n✅ TODAS LAS PRUEBAS PASARON" -ForegroundColor Green
} else {
    Write-Host "`n❌ PRUEBAS FALLIDAS" -ForegroundColor Red
}

Write-Host "`n🎉 Pruebas completadas" -ForegroundColor Cyan
```

**Ejecutar:**
```powershell
.\test-sistema.ps1
```

---

## Validaciones a Realizar

### ✅ Checklist de Pruebas

- [ ] Backend responde en puerto 3000
- [ ] Frontend carga en puerto 3001
- [ ] MySQL está corriendo (XAMPP)
- [ ] Base de datos `tiki_taka_db` existe
- [ ] Tabla `ventas` existe
- [ ] POST /api/ventas crea venta Tipo A
- [ ] POST /api/ventas crea venta Tipo B
- [ ] POST /api/ventas crea venta Tipo C
- [ ] GET /api/ventas retorna todas las ventas
- [ ] GET /api/ventas/estadisticas calcula correctamente
- [ ] GET /api/ventas/tipo/A filtra correctamente
- [ ] DELETE /api/ventas elimina todas las ventas
- [ ] Frontend muestra formulario
- [ ] Frontend muestra estadísticas
- [ ] Frontend muestra tabla de ventas
- [ ] Clasificación automática funciona
- [ ] Actualización en tiempo real funciona
- [ ] Botón limpiar funciona
- [ ] Validación de montos funciona
- [ ] Manejo de errores funciona

---

## Casos de Prueba

### Caso 1: Clasificación Correcta

| Monto | Tipo Esperado | Categoría |
|-------|---------------|-----------|
| $2000 | A | > $1000 |
| $1001 | A | > $1000 |
| $1000 | B | > $500 y ≤ $1000 |
| $750  | B | > $500 y ≤ $1000 |
| $501  | B | > $500 y ≤ $1000 |
| $500  | C | ≤ $500 |
| $250  | C | ≤ $500 |
| $1    | C | ≤ $500 |

### Caso 2: Validaciones

| Input | Resultado Esperado |
|-------|-------------------|
| (vacío) | Error: "Monto inválido" |
| $0 | Error: "Monto debe ser positivo" |
| $-100 | Error: "Monto debe ser positivo" |
| "abc" | Error: "Monto debe ser número" |

### Caso 3: Estadísticas

**Entrada:**
- 2 ventas tipo A: $1500, $2000
- 1 venta tipo B: $750
- 2 ventas tipo C: $300, $450

**Salida esperada:**
- Total ventas: 5
- Ventas A: 2 (Total: $3500)
- Ventas B: 1 (Total: $750)
- Ventas C: 2 (Total: $750)
- Total general: $5000

---

## Monitoreo de Logs

### Backend Logs
```powershell
# Los logs aparecen en la terminal donde ejecutaste npm start
# Ejemplo de log exitoso:
# 2025-10-25T10:30:00.000Z - POST /api/ventas
# ✅ Conexión exitosa a MySQL (XAMPP)
```

### Frontend Logs
```powershell
# Abrir Developer Tools en el navegador (F12)
# Ir a la pestaña "Console"
# Buscar errores o advertencias
```

### MySQL Logs
```
# Ubicación: xampp/mysql/data/mysql_error.log
```

---

## Herramientas Recomendadas

1. **Postman** - Para pruebas de API más visuales
2. **phpMyAdmin** - Para verificar datos en MySQL
3. **React Developer Tools** - Extensión del navegador
4. **Thunder Client** (VS Code) - Cliente HTTP integrado

---

**¡Sistema listo para pruebas!** 🧪✅
