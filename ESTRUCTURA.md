# 🌳 Estructura Completa del Proyecto

```
LAB1TEMA2G2/
│
├── 📄 .gitignore                          # Archivos a ignorar en Git
├── 📘 README.md                           # Documentación principal
├── 🚀 INICIO-RAPIDO.md                    # Guía de inicio rápido
├── 🧪 PRUEBAS.md                          # Comandos de prueba
├── 📊 RESUMEN-PROYECTO.md                 # Resumen ejecutivo
│
├── 🎮 backend/                            # CONTROLADOR + MODELO (Node.js)
│   ├── 📁 config/
│   │   └── database.js                    # ⚙️ Configuración MySQL
│   │
│   ├── 📁 models/                         # 💾 MODELO - Capa de datos
│   │   └── VentasModel.js                 # Lógica de negocio + SQL
│   │
│   ├── 📁 controllers/                    # 🎮 CONTROLADOR - Capa API
│   │   └── VentasController.js            # Manejo de peticiones HTTP
│   │
│   ├── 📁 routes/                         # 🛣️ Rutas REST
│   │   └── ventas.routes.js               # Definición endpoints
│   │
│   ├── 📄 .env                            # Variables de entorno
│   ├── 📄 package.json                    # Dependencias backend
│   ├── 📄 package-lock.json
│   ├── 📄 server.js                       # 🚀 Servidor Express
│   └── 📁 node_modules/                   # Dependencias (ignorado)
│
├── 📱 frontend/                           # VISTA (React)
│   ├── 📁 public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/                 # 🎨 VISTA - Componentes
│   │   │   ├── FormularioVenta.js         # Formulario de registro
│   │   │   ├── FormularioVenta.css
│   │   │   ├── EstadisticasVentas.js      # Estadísticas visuales
│   │   │   ├── EstadisticasVentas.css
│   │   │   ├── TablaVentas.js             # Tabla de ventas
│   │   │   └── TablaVentas.css
│   │   │
│   │   ├── 📁 services/                   # 🌐 Servicios API
│   │   │   └── api.js                     # Cliente HTTP (axios)
│   │   │
│   │   ├── App.js                         # 🏠 Componente principal
│   │   ├── App.css                        # Estilos globales
│   │   └── index.js                       # Punto de entrada React
│   │
│   ├── 📄 package.json                    # Dependencias frontend
│   ├── 📄 package-lock.json
│   └── 📁 node_modules/                   # Dependencias (ignorado)
│
├── 💾 database/                           # Base de Datos
│   └── schema.sql                         # 📜 Script SQL (MySQL)
│
└── 📚 docs/                               # Documentación técnica
    ├── diagrama-flujo.md                  # 📊 Diagramas de flujo
    ├── pseudocodigo.md                    # 📝 Pseudocódigo
    └── diagrama-ns.md                     # 📐 Diagrama N/S
```

---

## 📦 Desglose por Tipo de Archivo

### Backend (Node.js/Express)
```
backend/
├── JavaScript (.js)       6 archivos
├── JSON (.json)           2 archivos
├── Environment (.env)     1 archivo
└── Total                  9 archivos + node_modules
```

### Frontend (React)
```
frontend/
├── JavaScript (.js)       7 archivos
├── CSS (.css)             4 archivos
├── HTML (.html)           1 archivo
├── JSON (.json)           3 archivos
└── Total                  15 archivos + node_modules
```

### Base de Datos (MySQL)
```
database/
└── SQL (.sql)             1 archivo
```

### Documentación
```
docs/
└── Markdown (.md)         3 archivos

Raíz/
├── README.md
├── INICIO-RAPIDO.md
├── PRUEBAS.md
├── RESUMEN-PROYECTO.md
└── .gitignore
```

---

## 🎯 Separación MVC en la Estructura

### 📱 VISTA (View)
```
frontend/src/
├── components/
│   ├── FormularioVenta.js      👤 Interfaz de usuario
│   ├── EstadisticasVentas.js   👤 Interfaz de usuario
│   └── TablaVentas.js          👤 Interfaz de usuario
└── App.js                       👤 Orquestador de vistas
```

### 🎮 CONTROLADOR (Controller)
```
backend/
├── controllers/
│   └── VentasController.js      🎮 Lógica de control
├── routes/
│   └── ventas.routes.js         🎮 Enrutamiento
└── server.js                     🎮 Servidor principal
```

### 💾 MODELO (Model)
```
backend/
├── models/
│   └── VentasModel.js           💾 Lógica de negocio
├── config/
│   └── database.js              💾 Conexión a BD
└── ../database/
    └── schema.sql                💾 Estructura de datos
```

---

## 🔗 Flujo de Comunicación entre Archivos

```
┌─────────────────────────────────────────────────────────┐
│  USUARIO INTERACTÚA                                     │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│  VISTA (React)                                          │
│  ┌──────────────────────────────────────┐              │
│  │ FormularioVenta.js                   │              │
│  │   ↓ usa                              │              │
│  │ api.js                               │              │
│  │   ↓ llama                            │              │
│  │ POST http://localhost:3000/api/ventas│              │
│  └──────────────────────────────────────┘              │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP Request (JSON)
┌─────────────────▼───────────────────────────────────────┐
│  CONTROLADOR (Express)                                  │
│  ┌──────────────────────────────────────┐              │
│  │ server.js                            │              │
│  │   ↓ enruta a                         │              │
│  │ ventas.routes.js                     │              │
│  │   ↓ llama a                          │              │
│  │ VentasController.crearVenta()        │              │
│  │   ↓ invoca                           │              │
│  └──────────────────────────────────────┘              │
└─────────────────┬───────────────────────────────────────┘
                  │ Llamada a método
┌─────────────────▼───────────────────────────────────────┐
│  MODELO (Lógica de Negocio)                            │
│  ┌──────────────────────────────────────┐              │
│  │ VentasModel.crearVenta()             │              │
│  │   ↓ clasifica venta                  │              │
│  │   ↓ usa conexión                     │              │
│  │ database.js                          │              │
│  │   ↓ ejecuta                          │              │
│  └──────────────────────────────────────┘              │
└─────────────────┬───────────────────────────────────────┘
                  │ SQL Query
┌─────────────────▼───────────────────────────────────────┐
│  BASE DE DATOS (MySQL)                                  │
│  ┌──────────────────────────────────────┐              │
│  │ schema.sql (estructura)              │              │
│  │   → tabla: ventas                    │              │
│  │   → INSERT INTO ventas...            │              │
│  │   → retorna insertId                 │              │
│  └──────────────────────────────────────┘              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Retorno de datos (camino inverso)
                  ↓
                USUARIO VE RESULTADO
```

---

## 📊 Estadísticas del Proyecto

| Categoría | Cantidad |
|-----------|----------|
| **Archivos totales** | 30+ |
| **Líneas de código** | ~2000+ |
| **Componentes React** | 3 |
| **Endpoints API** | 5 |
| **Tablas MySQL** | 1 |
| **Archivos de documentación** | 8 |
| **Dependencias NPM** | ~1350 |

---

## 🎨 Convenciones de Nombres

### Backend
- **Archivos:** PascalCase con sufijo (VentasModel.js, VentasController.js)
- **Rutas:** kebab-case (ventas.routes.js)
- **Variables:** camelCase (ventasData, resultado)
- **Constantes:** UPPER_SNAKE_CASE (API_URL, DB_HOST)

### Frontend
- **Componentes:** PascalCase (FormularioVenta.js)
- **Estilos:** kebab-case (formulario-venta.css)
- **Funciones:** camelCase (handleSubmit, cargarDatos)
- **Variables:** camelCase (ventas, estadisticas)

### Base de Datos
- **Tablas:** snake_case (ventas)
- **Columnas:** snake_case (total_tipo_a, ventas_tipo_b)

---

## 🔐 Archivos de Configuración

```
.env (backend)
├── DB_HOST=localhost
├── DB_USER=root
├── DB_PASSWORD=
├── DB_NAME=tiki_taka_db
├── DB_PORT=3306
└── PORT=3000

package.json (backend)
├── express
├── mysql2
├── cors
├── dotenv
└── body-parser

package.json (frontend)
├── react
├── react-dom
├── react-scripts
└── axios
```

---

## 🚀 Puntos de Entrada

1. **Backend:** `backend/server.js`
2. **Frontend:** `frontend/src/index.js`
3. **Base de Datos:** `database/schema.sql`

---

## 📝 Archivos de Documentación por Orden de Lectura

1. **README.md** - Empieza aquí
2. **INICIO-RAPIDO.md** - Instalación rápida
3. **RESUMEN-PROYECTO.md** - Visión general
4. **docs/diagrama-flujo.md** - Diagramas visuales
5. **docs/pseudocodigo.md** - Lógica del algoritmo
6. **docs/diagrama-ns.md** - Diagrama N/S
7. **PRUEBAS.md** - Cómo probar el sistema

---

**Estructura completa y organizada siguiendo las mejores prácticas de MVC** ✅
