# Script de inicio automático - Tiki Taka
# Ejecuta backend y frontend simultáneamente

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 Iniciando Sistema Tiki Taka              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
$projectPath = $PSScriptRoot
if (-not (Test-Path "$projectPath\backend") -or -not (Test-Path "$projectPath\frontend")) {
    Write-Host "❌ Error: No se encontraron las carpetas backend y frontend" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la raíz del proyecto" -ForegroundColor Yellow
    pause
    exit
}

# Iniciar Backend
Write-Host "📡 Iniciando Backend (Puerto 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; Write-Host '🎮 BACKEND - Servidor Node.js' -ForegroundColor Green; npm start"

# Esperar 3 segundos para que el backend inicie
Write-Host "⏳ Esperando a que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "📱 Iniciando Frontend (Puerto 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; Write-Host '📱 FRONTEND - Aplicación React' -ForegroundColor Green; npm start"

# Esperar 2 segundos
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ Aplicación Iniciada Correctamente        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   • Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3001" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host "   • Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host ""
Write-Host "📝 Nota: Se abrirán 2 ventanas de PowerShell adicionales" -ForegroundColor Gray
Write-Host "   - Una para el Backend" -ForegroundColor Gray
Write-Host "   - Una para el Frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para detener: Presiona Ctrl+C en cada ventana" -ForegroundColor Gray
Write-Host ""
Write-Host "⏱️  El navegador se abrirá automáticamente en unos segundos..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
