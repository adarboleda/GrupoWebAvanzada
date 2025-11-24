# 🚀 GUÍA RÁPIDA - BANCO BANDIDO DE PELUCHE

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias Backend
```powershell
cd "C:\ESPE\WebAvanzada\Unidad 2\2. Fetch - banco_peluche\bancho_peluche"
npm install
```

### Paso 2: Iniciar MongoDB
**Opción A: MongoDB Local**
```powershell
# En otra ventana PowerShell (o terminal del sistema)
mongod
```

**Opción B: MongoDB Atlas (Cloud)**
- Editar `.env` con tu URI de MongoDB Atlas

### Paso 3: Ejecutar Backend
```powershell
# Desde la carpeta bancho_peluche
npm run dev
```
✅ Debe ver: `Servidor Banco Bandido escuchando en http://localhost:3000`

### Paso 4: Abrir Frontend
```powershell
# En otra ventana, en la carpeta del frontend
cd "C:\ESPE\WebAvanzada\Unidad 2\2. Fetch - banco_peluche\bancho_peluche_front"

# Opción 1: Abrir directamente en navegador
start .\index.html

# Opción 2: Con servidor local
npm install -g http-server
http-server -p 8080
# Luego ir a http://localhost:8080/index.html
```

---

## ✨ Funcionalidades Principales

### 1️⃣ Ver Estadísticas
- **Total de Clientes:** Se actualiza en tiempo real
- **Morosos:** Clientes con pago menor a 15% del saldo
- **No Morosos:** Clientes con pagos al día

### 2️⃣ Crear Cliente
```
Nombre: "Carlos"
Saldo Anterior: 500
Compras: 200
Pago: 50
↓
Sistema calcula automáticamente:
✓ Saldo Base
✓ Interés (si es moroso)
✓ Multa (si es moroso)
✓ Saldo Actual
```

### 3️⃣ Filtrar Clientes
- `Todos` → Mostrar todos
- `Morosos` → Solo con deuda
- `No Morosos` → Solo al día

### 4️⃣ Ver Detalle
- Click en botón "Ver Detalle"
- Modal con información completa
- Cierra con X

### 5️⃣ Descargar Reportes
- **Excel:** Tabla con todos los datos
- **PDF:** Reporte formateado con estadísticas

---

## 🔧 Configuración (.env)

El archivo `.env` ya está configurado:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/BancoBandidoPeluche
```

**Para MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/BancoBandidoPeluche
```

---

## 📋 Lógica de Cálculo (Validada)

```
ENTRADA: Cliente nuevo
├─ Nombre (requerido)
├─ Saldo Anterior
├─ Monto Compras
└─ Pago Realizado

PROCESAMIENTO:
1. Saldo Base = Anterior + Compras - Pago
2. Pago Mínimo Base = Saldo Base × 15%
3. ¿Es Moroso? = Pago < Pago Mínimo Base
4. Si es moroso:
   ├─ Interés = Saldo Base × 12%
   └─ Multa = $200
5. Saldo Actual = Saldo Base + Interés + Multa
6. Pago Mínimo = Saldo Actual × 15%
7. Pago Sin Intereses = Saldo Actual × 85%

SALIDA: Cliente guardado en MongoDB
```

---

## 🎯 Endpoints API

### Crear Cliente
```
POST http://localhost:3000/api/clientes
{
  "nombre": "Juan",
  "saldoAnterior": 100,
  "montoCompras": 250,
  "pagoRealizado": 50
}
```

### Listar Todos
```
GET http://localhost:3000/api/clientes
```

### Estadísticas
```
GET http://localhost:3000/api/clientes/estadisticas
```

### Solo Morosos
```
GET http://localhost:3000/api/clientes/morosos
```

### Solo No Morosos
```
GET http://localhost:3000/api/clientes/no-morosos
```

### Detalle Cliente
```
GET http://localhost:3000/api/clientes/:id
```

### Eliminar Cliente
```
DELETE http://localhost:3000/api/clientes/:id
```

---

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `Cannot GET /` | Asegúrate que el backend esté en puerto 3000 |
| `Connection refused` | MongoDB no está corriendo o no existe |
| `CORS error` | El backend está deshabilitado o no inició |
| `Table not loading` | Abre F12 y verifica la consola para errores |
| `Cannot save data` | Verifica que MongoDB esté accesible |

---

## 📊 Ejemplo Práctico

**Crear un cliente:**
1. Nombre: `María García`
2. Saldo Anterior: `$1000`
3. Compras: `$500`
4. Pago Realizado: `$100`

**Resultado automático:**
- ✅ Saldo Base: `$1400`
- ✅ Pago Mínimo Base: `$210`
- ⚠️ Es Moroso: **SÍ** (100 < 210)
- 💰 Interés: `$168`
- 💸 Multa: `$200`
- 📊 Saldo Actual: `$1768`

---

## 📚 Estructura Respaldada

✅ Sigue la estructura de `ejemploMongo`
✅ Usa patrones MVC (Model-View-Controller)
✅ Validaciones en backend
✅ Cálculos precisos
✅ Exportación a Excel/PDF
✅ Filtrado por estado

---

## 🎓 Nota de Aprendizaje

Este proyecto implementa:
- **Backend REST API** con Express.js
- **Base de datos NoSQL** con MongoDB
- **Validaciones** en servidor
- **Lógica de negocio** compleja
- **Frontend interactivo** con Axios
- **Exportación** de datos
- **Manejo de errores** robusto

**Todo respetando las guías y estructura del curso.**

---

Cualquier duda, revisa el archivo `README.md` completo.
