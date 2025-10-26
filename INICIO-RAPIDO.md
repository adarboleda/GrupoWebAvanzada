# 🚀 Guía Rápida de Inicio - Sistema Tiki Taka

## ⚡ Pasos de Instalación Rápida

### 1️⃣ Configurar MySQL (XAMPP)

```powershell
# 1. Abrir XAMPP Control Panel
# 2. Iniciar Apache y MySQL
# 3. Abrir phpMyAdmin: http://localhost/phpmyadmin
# 4. Ir a pestaña "SQL"
# 5. Copiar y ejecutar: database/schema.sql
```

### 2️⃣ Configurar Backend

```powershell
# Navegar a la carpeta backend
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\backend"

# Instalar dependencias
npm install

# Iniciar servidor (puerto 3000)
npm start
```

**Salida esperada:**
```
╔════════════════════════════════════════════════╗
║   🚀 Servidor Tiki Taka iniciado               ║
║   📡 Puerto: 3000                              ║
║   🌐 URL: http://localhost:3000                ║
║   📊 Arquitectura: MVC                         ║
║   💾 Base de datos: MySQL (XAMPP)              ║
╚════════════════════════════════════════════════╝
✅ Conexión exitosa a MySQL (XAMPP)
```

### 3️⃣ Configurar Frontend

```powershell
# En OTRA terminal, navegar a la carpeta frontend
cd "c:\Users\User\Desktop\Programacion Web Avanzada\LAB1TEMA2G2\frontend"

# Iniciar React (puerto 3001)
npm start
```

## ✅ Verificación

### Probar Backend
Abre: http://localhost:3000

Deberías ver:
```json
{
  "message": "API de Tiki Taka - Sistema de Ventas MVC",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### Probar Frontend
Abre: http://localhost:3001

Deberías ver la interfaz del sistema de ventas.

## 🧪 Prueba Rápida

1. **Registrar una venta:**
   - Monto: 1500
   - Click: "Registrar Venta"
   - ✅ Debe clasificarse como Tipo A

2. **Ver estadísticas:**
   - Debe mostrar 1 venta tipo A
   - Total: $1500

3. **Ver tabla:**
   - Debe aparecer la venta en el listado

## 🔧 Solución de Problemas

### Error: "Cannot connect to MySQL"
```powershell
# Verificar que MySQL esté ejecutándose en XAMPP
# Verificar credenciales en backend/.env:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=tiki_taka_db
```

### Error: "CORS policy"
```powershell
# Verificar que el backend esté corriendo en puerto 3000
# El CORS ya está configurado en backend/server.js
```

### Error: "Module not found"
```powershell
# Reinstalar dependencias
cd backend
npm install

cd ../frontend
npm install
```

## 📊 Arquitectura del Proyecto

```
VISTA (React - Puerto 3001)
    ↓ HTTP Request
CONTROLADOR (Express - Puerto 3000)
    ↓ SQL Query
MODELO (MySQL - Puerto 3306)
```

## 🎯 Endpoints API Disponibles

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | http://localhost:3000/api/ventas | Listar ventas |
| POST | http://localhost:3000/api/ventas | Crear venta |
| GET | http://localhost:3000/api/ventas/estadisticas | Estadísticas |
| DELETE | http://localhost:3000/api/ventas | Eliminar todas |

## 📁 Estructura de Archivos Clave

```
backend/
├── server.js              # Servidor principal
├── config/database.js     # Conexión MySQL
├── models/VentasModel.js  # MODELO
├── controllers/VentasController.js  # CONTROLADOR
└── routes/ventas.routes.js  # Rutas API

frontend/
└── src/
    ├── App.js             # Componente principal
    ├── components/        # Componentes VISTA
    └── services/api.js    # Cliente API

database/
└── schema.sql             # Script de BD
```

## 🎨 Variables de Entorno (backend/.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tiki_taka_db
DB_PORT=3306
PORT=3000
```

## 🔄 Flujo de Datos Verificado

1. **Usuario ingresa $1500 en formulario React**
2. **React envía POST a /api/ventas**
3. **Controller recibe y valida**
4. **Model clasifica como tipo 'A' (> $1000)**
5. **MySQL guarda: INSERT INTO ventas...**
6. **MySQL retorna ID de venta**
7. **Model retorna { id, monto, tipo }**
8. **Controller envía JSON response**
9. **React actualiza UI automáticamente**

## 📖 Documentación Adicional

- **README.md** - Documentación completa
- **docs/diagrama-flujo.md** - Diagrama de flujo
- **docs/pseudocodigo.md** - Pseudocódigo
- **docs/diagrama-ns.md** - Diagrama Nassi-Shneiderman

## 💡 Comandos Útiles

```powershell
# Backend modo desarrollo (auto-reload)
cd backend
npm run dev

# Ver logs de MySQL en XAMPP
# Abrir: xampp/mysql/data/mysql_error.log

# Limpiar base de datos
# Ejecutar en phpMyAdmin: DELETE FROM ventas;

# Verificar puertos en uso
netstat -ano | findstr :3000
netstat -ano | findstr :3306
```

---

**¡Listo! Tu sistema MVC está funcionando.** 🎉
