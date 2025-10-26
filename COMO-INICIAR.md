# 🚀 CÓMO INICIAR EL PROYECTO

## Pasos Rápidos para Ejecutar

### 1️⃣ Iniciar MySQL (XAMPP)
```
1. Abre XAMPP Control Panel
2. Click en "Start" en MySQL
3. Espera a que esté en verde
```

### 2️⃣ Crear la Base de Datos
```
1. Abre: http://localhost/phpmyadmin
2. Click en pestaña "SQL"
3. Copia todo el contenido de: database/schema.sql
4. Pega en el cuadro de SQL
5. Click en "Ejecutar" o "Go"
```

### 3️⃣ Iniciar Backend (Terminal 1)
```powershell
# Abrir PowerShell/CMD
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\backend"
npm start
```

**Debe mostrar:**
```
╔════════════════════════════════════════════════╗
║   🚀 Servidor Tiki Taka iniciado               ║
║   📡 Puerto: 3000                              ║
║   🌐 URL: http://localhost:3000                ║
╚════════════════════════════════════════════════╝
✅ Conexión exitosa a MySQL (XAMPP)
```

### 4️⃣ Iniciar Frontend (Terminal 2 - NUEVA TERMINAL)
```powershell
# Abrir OTRA PowerShell/CMD (nueva ventana)
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\frontend"
npm start
```

**Se abrirá automáticamente:** http://localhost:3001

---

## 🌐 Acceder a la Aplicación Web

Una vez iniciados los dos servidores:

**Abre tu navegador en:** 
### 👉 http://localhost:3001

**También puedes verificar el backend en:**
### 👉 http://localhost:3000

---

## ⚡ Inicio Rápido (Copiar y Pegar)

### Opción A: Dos Terminales Separadas

**Terminal 1 (Backend):**
```powershell
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\backend"
npm start
```

**Terminal 2 (Frontend):**
```powershell
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\frontend"
npm start
```

### Opción B: Un Solo Comando (PowerShell)

Crea un archivo `iniciar.ps1` en la raíz del proyecto:

```powershell
# Guardar como: iniciar.ps1
Write-Host "🚀 Iniciando Tiki Taka..." -ForegroundColor Cyan

# Iniciar backend en proceso en segundo plano
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"

Write-Host "✅ Aplicación iniciada!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor Yellow
Write-Host "📡 Backend: http://localhost:3000" -ForegroundColor Yellow
```

**Ejecutar:**
```powershell
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2"
.\iniciar.ps1
```

---

## 🔍 Verificar que Todo Funciona

1. **MySQL corriendo:** XAMPP Panel - MySQL en verde
2. **Backend corriendo:** http://localhost:3000 muestra JSON
3. **Frontend corriendo:** http://localhost:3001 muestra la aplicación

---

## 🛑 Cómo Detener

**En cada terminal:**
- Presiona `Ctrl + C`
- Confirma con `S` o `Y`

---

## ❌ Si Algo No Funciona

### Error: "Cannot connect to MySQL"
```powershell
# Verifica que MySQL esté corriendo en XAMPP
```

### Error: "Port 3000 is already in use"
```powershell
# Detén otros procesos en ese puerto
netstat -ano | findstr :3000
taskkill /PID <número_pid> /F
```

### Error: "Module not found"
```powershell
# Reinstala dependencias
cd backend
npm install

cd ../frontend
npm install
```

---

## 🎯 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3001 | **Aplicación principal (USAR ESTA)** |
| Backend API | http://localhost:3000 | API REST |
| phpMyAdmin | http://localhost/phpmyadmin | Administrar BD |
| XAMPP | http://localhost | Panel XAMPP |

---

**🌟 LA APLICACIÓN WEB ESTÁ EN: http://localhost:3001** 🌟
