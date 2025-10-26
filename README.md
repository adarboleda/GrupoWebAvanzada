# 🏪 Sistema de Ventas Tiki Taka - Arquitectura MVC

## � Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Arquitectura MVC](#️-arquitectura-mvc)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Verificación del Flujo de Datos MVC](#-verificación-del-flujo-de-datos-mvc)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Pruebas](#-pruebas)
- [Variables del Algoritmo](#-variables-del-algoritmo)
- [Separación de Responsabilidades](#-separación-de-responsabilidades)
- [Características Implementadas](#-características-implementadas)

> 💡 **Documentación Adicional:** Ver [INDICE.md](INDICE.md) para acceder a toda la documentación del proyecto.

---

## �📋 Descripción del Proyecto

Sistema de gestión de ventas implementado con arquitectura MVC (Modelo-Vista-Controlador) que permite registrar, clasificar y analizar ventas diarias de la tienda "Tiki Taka".

### 🎯 Objetivo
Implementar un proyecto que demuestre la **separación de responsabilidades** entre Modelo, Vista y Controlador, verificando el flujo de datos entre capas.

## 🏗️ Arquitectura MVC

### Stack Tecnológico
- **Vista (View):** React.js
- **Controlador (Controller):** Node.js + Express.js
- **Modelo (Model):** MySQL (XAMPP)

### 📊 Flujo de Datos

```
┌──────────────┐      HTTP Request      ┌─────────────────┐
│              │  ──────────────────>   │                 │
│  VISTA       │                        │  CONTROLADOR    │
│  (React)     │  <──────────────────   │  (Express API)  │
│              │      HTTP Response     │                 │
└──────────────┘                        └─────────────────┘
                                                │
                                                │ SQL Queries
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │     MODELO      │
                                        │     (MySQL)     │
                                        │                 │
                                        └─────────────────┘
```

## 📁 Estructura del Proyecto

```
LAB1TEMA2G2/
│
├── backend/                    # Servidor Node.js (Controlador + Modelo)
│   ├── config/
│   │   └── database.js        # ⚙️ Configuración de conexión MySQL
│   ├── models/
│   │   └── VentasModel.js     # 📦 MODELO - Lógica de negocio
│   ├── controllers/
│   │   └── VentasController.js # 🎮 CONTROLADOR - Gestión de peticiones
│   ├── routes/
│   │   └── ventas.routes.js   # 🛣️ Definición de endpoints API
│   ├── .env                   # Variables de entorno
│   ├── package.json
│   └── server.js              # 🚀 Servidor principal
│
├── frontend/                  # Aplicación React (Vista)
│   ├── src/
│   │   ├── components/        # 🎨 VISTA - Componentes React
│   │   │   ├── FormularioVenta.js
│   │   │   ├── EstadisticasVentas.js
│   │   │   └── TablaVentas.js
│   │   ├── services/
│   │   │   └── api.js         # 🌐 Comunicación con API
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
├── database/
│   └── schema.sql             # 🗄️ Script SQL para crear BD
│
└── docs/
    ├── README.md              # Esta documentación
    ├── diagrama-flujo.md      # Diagrama de flujo
    ├── pseudocodigo.md        # Pseudocódigo del algoritmo
    └── diagrama-ns.md         # Diagrama N/S
```

## 🔧 Instalación y Configuración

### Prerrequisitos

1. **XAMPP** instalado y MySQL ejecutándose
2. **Node.js** (v14 o superior)
3. **npm** o **yarn**

### Paso 1: Configurar la Base de Datos

1. Inicia XAMPP y ejecuta MySQL
2. Abre phpMyAdmin: `http://localhost/phpmyadmin`
3. Ve a la pestaña "SQL"
4. Copia y ejecuta el contenido de `database/schema.sql`

### Paso 2: Configurar el Backend

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno (ya existe .env)
# Verifica que los datos de conexión sean correctos

# Iniciar el servidor
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### Paso 3: Configurar el Frontend

```powershell
# En otra terminal, navegar a la carpeta frontend
cd frontend

# Instalar dependencias (si no se hizo con create-react-app)
npm install

# Iniciar la aplicación React
npm start
```

La aplicación estará disponible en: `http://localhost:3001`

## 🎮 Uso del Sistema

### Registrar una Venta

1. En el formulario "Registrar Nueva Venta"
2. Ingresa el monto de la venta
3. Haz clic en "Registrar Venta"
4. El sistema clasificará automáticamente la venta:
   - **Tipo A:** Mayor a $1000
   - **Tipo B:** Mayor a $500 pero ≤ $1000
   - **Tipo C:** Menor o igual a $500

### Ver Estadísticas

Las estadísticas se actualizan automáticamente mostrando:
- Total de ventas
- Cantidad de ventas por tipo (A, B, C)
- Monto total por tipo
- Monto total general

### Ver Historial

La tabla muestra todas las ventas registradas con:
- ID de la venta
- Monto
- Tipo (con badge de color)
- Fecha y hora de registro

## 🔄 Verificación del Flujo de Datos MVC

### 1️⃣ Vista → Controlador

**Ejemplo: Crear una venta**

```javascript
// VISTA (FormularioVenta.js)
const handleSubmit = async (e) => {
  const resultado = await crearVenta(parseFloat(monto));
  // Envía datos al controlador vía API REST
};
```

```javascript
// SERVICIO API (api.js)
export const crearVenta = async (monto) => {
  const response = await api.post('/ventas', { monto });
  return response.data.data;
};
```

### 2️⃣ Controlador → Modelo

```javascript
// CONTROLADOR (VentasController.js)
static async crearVenta(req, res) {
  const { monto } = req.body;
  // Llama al modelo para procesar la venta
  const resultado = await VentasModel.crearVenta(parseFloat(monto));
  res.status(201).json({ success: true, data: resultado });
}
```

### 3️⃣ Modelo → Base de Datos

```javascript
// MODELO (VentasModel.js)
static async crearVenta(monto) {
  // Clasificar la venta
  let tipo = monto > 1000 ? 'A' : monto > 500 ? 'B' : 'C';
  
  // Insertar en la base de datos
  const query = 'INSERT INTO ventas (monto, tipo, fecha) VALUES (?, ?, NOW())';
  const [result] = await db.execute(query, [monto, tipo]);
  
  return { id: result.insertId, monto, tipo, success: true };
}
```

### 4️⃣ Base de Datos → Vista (Retorno)

```
MySQL → Modelo → Controlador → API REST → Vista (React)
```

## 📊 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ventas` | Obtener todas las ventas |
| POST | `/api/ventas` | Crear nueva venta |
| GET | `/api/ventas/estadisticas` | Obtener estadísticas |
| GET | `/api/ventas/tipo/:tipo` | Obtener ventas por tipo (A, B, C) |
| DELETE | `/api/ventas` | Eliminar todas las ventas |

## 🧪 Pruebas

### Opción 1: Postman (Recomendado) 📮

Importa la colección completa de Postman para probar todos los endpoints:

```powershell
# Ver guía completa
cat postman/GUIA-POSTMAN.md

# O ejecutar pruebas automatizadas con PowerShell
.\postman\probar-api.ps1
```

**Archivos incluidos:**
- `postman/Tiki_Taka_API.postman_collection.json` - Colección con 6 endpoints
- `postman/Tiki_Taka_Environment.postman_environment.json` - Variables de entorno
- `postman/GUIA-POSTMAN.md` - Guía completa de uso
- `postman/probar-api.ps1` - Script de pruebas automático

**Inicio rápido:**
1. Descarga Postman: https://www.postman.com/downloads/
2. Importa los archivos JSON desde la carpeta `postman/`
3. Selecciona el entorno "Tiki Taka - Desarrollo"
4. ¡Empieza a probar!

Ver documentación completa: [postman/README.md](postman/README.md)

### Opción 2: Probar con cURL

```powershell
# Crear una venta
curl -X POST http://localhost:3000/api/ventas -H "Content-Type: application/json" -d "{\"monto\": 1500}"

# Obtener estadísticas
curl http://localhost:3000/api/ventas/estadisticas

# Obtener todas las ventas
curl http://localhost:3000/api/ventas
```

## 📚 Variables del Algoritmo

Según la especificación del problema:

| Variable | Descripción | Tipo |
|----------|-------------|------|
| N | Número de ventas | Real |
| CN | Contador de ventas | Real |
| A | Ventas mayores a mil | Entero |
| B | Ventas mayores a 500 pero ≤ 1000 | Entero |
| C | Ventas menores o iguales a 500 | Entero |
| V | Monto de la venta | Real |
| T1 | Total de ventas tipo A | Real |
| T2 | Total de ventas tipo B | Real |
| T3 | Total de ventas tipo C | Real |
| TT | Total de las ventas | Real |

## 🎯 Separación de Responsabilidades

### ✅ MODELO (MySQL + VentasModel.js)
- ✓ Gestiona la persistencia de datos
- ✓ Implementa la lógica de clasificación de ventas
- ✓ Realiza cálculos y consultas SQL
- ✓ NO conoce nada sobre HTTP o React

### ✅ VISTA (React Components)
- ✓ Presenta la información al usuario
- ✓ Captura entradas del usuario
- ✓ Actualiza la UI automáticamente
- ✓ NO contiene lógica de negocio
- ✓ NO accede directamente a la base de datos

### ✅ CONTROLADOR (Express Controllers + Routes)
- ✓ Gestiona peticiones HTTP
- ✓ Valida datos de entrada
- ✓ Coordina entre Modelo y Vista
- ✓ Envía respuestas en formato JSON
- ✓ NO implementa lógica de negocio
- ✓ NO genera HTML

## 🚀 Características Implementadas

✅ Arquitectura MVC completa
✅ API RESTful
✅ Interfaz de usuario responsive
✅ Clasificación automática de ventas
✅ Estadísticas en tiempo real
✅ Persistencia en base de datos MySQL
✅ Manejo de errores
✅ Validación de datos
✅ Documentación completa

## 👥 Autores

Laboratorio 1 - Tema 2 - Grupo 2

## 📄 Licencia

Este proyecto es parte de un ejercicio académico.
