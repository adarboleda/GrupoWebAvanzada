# 🚀 Guía Rápida de Inicio

## ⚡ Inicio Rápido (Quick Start)

### 1️⃣ Crear la Base de Datos
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS gestion_equipos;"
```

### 2️⃣ Iniciar el Backend
```bash
cd Back-end
npm install
npm run dev
```
✅ Servidor corriendo en: http://localhost:3000

### 3️⃣ Iniciar el Frontend
```bash
cd 13.Avalon-react
npm install
npm run dev
```
✅ Aplicación corriendo en: http://localhost:3001

## 📌 Endpoints Principales

### Equipos
- **GET** `/api/equipos` - Lista todos los equipos
- **POST** `/api/equipos` - Crear equipo
  ```json
  {
    "nombre": "Barcelona FC",
    "ciudad": "Barcelona",
    "estadio": "Camp Nou",
    "fundacion": 1899,
    "entrenador": "Xavi Hernández"
  }
  ```

### Jugadores  
- **GET** `/api/jugadores` - Lista todos los jugadores
- **GET** `/api/jugadores/equipo/:equipoId` - Jugadores por equipo
- **POST** `/api/jugadores` - Crear jugador
  ```json
  {
    "nombre": "Lionel",
    "apellido": "Messi",
    "fechaNacimiento": "1987-06-24",
    "nacionalidad": "Argentina",
    "posicion": "delantero",
    "numeroCamiseta": 10,
    "equipoId": 1
  }
  ```

## 🧪 Probar con Postman

1. Importar colección: `Back-end/Postman_Collection_Equipos_Jugadores.json`
2. Ejecutar requests de prueba

## 📱 Acceso a la Aplicación

1. Abrir navegador en: http://localhost:3001
2. En el menú lateral, navegar a:
   - **Equipos** - Para gestionar equipos
   - **Jugadores** - Para gestionar jugadores

## ⚠️ Solución de Problemas

### Backend no inicia
```bash
# Verificar que MySQL esté corriendo
# Verificar puerto 3000 disponible
# Revisar credenciales en .env
```

### Frontend no inicia
```bash
# Verificar puerto 3001 disponible
# Limpiar cache: npm run build
```

### Error de conexión a base de datos
```bash
# Verificar en .env:
DB_NAME=gestion_equipos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
```

## 📂 Estructura de Archivos Clave

```
Back-end/
├── app.js                      # Punto de entrada del servidor
├── .env                        # Configuración de base de datos
├── controller/
│   ├── equipoController.js     # Lógica de negocio equipos
│   └── jugadorController.js    # Lógica de negocio jugadores
├── models/
│   ├── equipo.js              # Modelo de equipo
│   ├── jugador.js             # Modelo de jugador
│   └── index.js               # Relaciones entre modelos
└── routes/
    ├── equipoRoutes.js        # Rutas API equipos
    └── jugadorRoutes.js       # Rutas API jugadores

13.Avalon-react/
├── app/(main)/
│   ├── equipos/page.jsx       # Página gestión equipos
│   └── jugadores/page.jsx     # Página gestión jugadores
├── demo/
│   ├── components/            # Componentes reutilizables
│   │   ├── EquipoForm.jsx
│   │   ├── EquipoTable.jsx
│   │   ├── JugadorForm.jsx
│   │   └── JugadorTable.jsx
│   └── service/              # Servicios API
│       ├── equipoService.js
│       └── jugadorService.js
└── layout/
    └── AppMenu.tsx           # Menú de navegación
```

## ✅ Checklist de Funcionalidades

### Equipos
- [x] Crear nuevo equipo
- [x] Listar todos los equipos
- [x] Ver detalles de un equipo
- [x] Editar equipo existente
- [x] Eliminar equipo (validando jugadores)

### Jugadores
- [x] Crear nuevo jugador
- [x] Listar todos los jugadores
- [x] Filtrar jugadores por equipo
- [x] Editar jugador existente
- [x] Eliminar jugador
- [x] Validación de número de camiseta único

### Validaciones
- [x] Campos obligatorios
- [x] Números de camiseta 1-99
- [x] Números únicos por equipo
- [x] No eliminar equipo con jugadores
- [x] Relación equipo-jugador intacta

## 🎓 Criterios de Evaluación Cumplidos

✅ Backend
- API REST implementada
- Operaciones CRUD completas
- Relación 1:N correctamente definida
- Base de datos relacional MySQL
- Validaciones en servidor
- Endpoints probados en Postman

✅ Frontend
- React + Next.js con PrimeReact
- Consume API REST correctamente
- Interfaces para todas las operaciones CRUD
- Formularios de registro y edición
- Tablas con listados
- Filtros funcionales
- Feedback visual (toasts, confirmaciones)

✅ Organización
- Estructura de carpetas clara
- Componentes reutilizables
- Servicios separados
- Código documentado
