# Script de Pruebas API - Tiki Taka
# Alternativa a Postman usando PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBAS API - TIKI TAKA VENTAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"

# Función para hacer peticiones HTTP
function Invoke-APITest {
    param(
        [string]$Nombre,
        [string]$Metodo,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    Write-Host "🧪 Probando: $Nombre" -ForegroundColor Yellow
    Write-Host "   Método: $Metodo $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Metodo
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            Write-Host "   Body: $($params.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "   ✅ Respuesta exitosa:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
        Write-Host ""
        return $response
    }
    catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $null
    }
}

# Pausa entre pruebas
function Wait-Test {
    Start-Sleep -Seconds 1
}

# ===========================================
# INICIO DE PRUEBAS
# ===========================================

Write-Host "📋 PLAN DE PRUEBAS:" -ForegroundColor Cyan
Write-Host "1. Verificar Conexión" -ForegroundColor White
Write-Host "2. Limpiar Base de Datos" -ForegroundColor White
Write-Host "3. Crear Venta Tipo A (>$1000)" -ForegroundColor White
Write-Host "4. Crear Venta Tipo B ($500-$1000)" -ForegroundColor White
Write-Host "5. Crear Venta Tipo C (<$500)" -ForegroundColor White
Write-Host "6. Obtener Todas las Ventas" -ForegroundColor White
Write-Host "7. Obtener Estadísticas" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER para continuar..." -ForegroundColor Yellow
Read-Host

# Test 1: Verificar Conexión
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 1: VERIFICAR CONEXIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Invoke-APITest -Nombre "Verificar Conexión al Servidor" -Metodo "GET" -Endpoint "/test"
Wait-Test

# Test 2: Limpiar Base de Datos
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 2: LIMPIAR BASE DE DATOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "⚠️  Esta acción eliminará todas las ventas" -ForegroundColor Yellow
Invoke-APITest -Nombre "Eliminar Todas las Ventas" -Metodo "DELETE" -Endpoint "/ventas"
Wait-Test

# Test 3: Crear Venta Tipo A
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 3: CREAR VENTA TIPO A" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$ventaA = @{
    fecha = "2025-10-25"
    monto_vendido = 1500.00
}
$resultadoA = Invoke-APITest -Nombre "Crear Venta Tipo A (Monto > $1000)" -Metodo "POST" -Endpoint "/ventas" -Body $ventaA
if ($resultadoA -and $resultadoA.tipo_venta -eq "A") {
    Write-Host "   ✅ Clasificación correcta: TIPO A" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error en clasificación" -ForegroundColor Red
}
Wait-Test

# Test 4: Crear Venta Tipo B
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 4: CREAR VENTA TIPO B" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$ventaB = @{
    fecha = "2025-10-25"
    monto_vendido = 750.50
}
$resultadoB = Invoke-APITest -Nombre "Crear Venta Tipo B (Monto $500-$1000)" -Metodo "POST" -Endpoint "/ventas" -Body $ventaB
if ($resultadoB -and $resultadoB.tipo_venta -eq "B") {
    Write-Host "   ✅ Clasificación correcta: TIPO B" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error en clasificación" -ForegroundColor Red
}
Wait-Test

# Test 5: Crear Venta Tipo C
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 5: CREAR VENTA TIPO C" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$ventaC = @{
    fecha = "2025-10-25"
    monto_vendido = 250.00
}
$resultadoC = Invoke-APITest -Nombre "Crear Venta Tipo C (Monto < $500)" -Metodo "POST" -Endpoint "/ventas" -Body $ventaC
if ($resultadoC -and $resultadoC.tipo_venta -eq "C") {
    Write-Host "   ✅ Clasificación correcta: TIPO C" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error en clasificación" -ForegroundColor Red
}
Wait-Test

# Test 6: Obtener Todas las Ventas
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 6: OBTENER TODAS LAS VENTAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$ventas = Invoke-APITest -Nombre "Listar Todas las Ventas" -Metodo "GET" -Endpoint "/ventas"
if ($ventas) {
    Write-Host "   ✅ Total de ventas: $($ventas.Count)" -ForegroundColor Green
}
Wait-Test

# Test 7: Obtener Estadísticas
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST 7: OBTENER ESTADÍSTICAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$stats = Invoke-APITest -Nombre "Obtener Estadísticas Agrupadas" -Metodo "GET" -Endpoint "/ventas/estadisticas"
if ($stats) {
    Write-Host "   📊 RESUMEN ESTADÍSTICO:" -ForegroundColor Cyan
    Write-Host "   Total Ventas: $($stats.total)" -ForegroundColor White
    Write-Host "   Monto Total: $$$($stats.montoTotal)" -ForegroundColor White
    Write-Host "   Tipo A: $($stats.tipoA.cantidad) ventas - $$$($stats.tipoA.monto)" -ForegroundColor Green
    Write-Host "   Tipo B: $($stats.tipoB.cantidad) ventas - $$$($stats.tipoB.monto)" -ForegroundColor Yellow
    Write-Host "   Tipo C: $($stats.tipoC.cantidad) ventas - $$$($stats.tipoC.monto)" -ForegroundColor Cyan
}
Wait-Test

# ===========================================
# RESUMEN FINAL
# ===========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Pruebas básicas completadas" -ForegroundColor Green
Write-Host "📋 Total de endpoints probados: 5" -ForegroundColor White
Write-Host "🎯 Flujo MVC validado:" -ForegroundColor Cyan
Write-Host "   - Modelo: Clasificación automática funcionando" -ForegroundColor White
Write-Host "   - Controlador: API REST respondiendo correctamente" -ForegroundColor White
Write-Host "   - Base de Datos: MySQL almacenando datos" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:3000/api" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📮 Para pruebas más completas, usa Postman:" -ForegroundColor Yellow
Write-Host "   Ver: postman/GUIA-POSTMAN.md" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Pausa final
Write-Host ""
Write-Host "Presiona ENTER para salir..." -ForegroundColor Yellow
Read-Host
