# Sistema de Gestión de Equipos y Jugadores

Sistema web completo para la gestión de equipos deportivos y sus jugadores, implementando operaciones CRUD mediante una arquitectura cliente-servidor.

## 🎯 Características

- **Gestión de Equipos**: Crear, listar, editar y eliminar equipos
- **Gestión de Jugadores**: Administrar jugadores asociados a equipos
- **Relación 1:N**: Un equipo puede tener varios jugadores
- **Validaciones**: Control de números de camiseta únicos por equipo
- **Filtros**: Listar jugadores por equipo específico
- **API REST**: Backend completo con endpoints validados

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- Sequelize ORM
- MySQL
- Arquitectura MVC

### Frontend
- React + Next.js
- PrimeReact (UI Components)
- TypeScript/JavaScript

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MySQL
- npm o yarn

## 🚀 Instalación y Configuración

### Backend

1. Navegar al directorio del backend:
```bash
cd Back-end
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos en `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_equipos
DB_DIALECT=mysql
PORT=3000
```

4. Crear la base de datos:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS gestion_equipos;"
```

5. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd 13.Avalon-react
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL de la API en un archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

### Backend
```
Back-end/
├── controller/
│   ├── equipoController.js
│   └── jugadorController.js
├── models/
│   ├── equipo.js
│   ├── jugador.js
│   └── index.js
├── routes/
│   ├── equipoRoutes.js
│   └── jugadorRoutes.js
├── config/
│   └── database.js
└── app.js
```

### Frontend
```
13.Avalon-react/
├── app/
│   └── (main)/
│       ├── equipos/
│       │   └── page.jsx
│       └── jugadores/
│           └── page.jsx
├── demo/
│   ├── components/
│   │   ├── EquipoForm.jsx
│   │   ├── EquipoTable.jsx
│   │   ├── JugadorForm.jsx
│   │   └── JugadorTable.jsx
│   └── service/
│       ├── equipoService.js
│       └── jugadorService.js
└── layout/
    └── AppMenu.tsx
```

## 🔌 Endpoints de la API

### Equipos
- `GET /api/equipos` - Obtener todos los equipos
- `GET /api/equipos/:id` - Obtener un equipo por ID
- `POST /api/equipos` - Crear un nuevo equipo
- `PUT /api/equipos/:id` - Actualizar un equipo
- `DELETE /api/equipos/:id` - Eliminar un equipo

### Jugadores
- `GET /api/jugadores` - Obtener todos los jugadores
- `GET /api/jugadores/equipo/:equipoId` - Obtener jugadores por equipo
- `GET /api/jugadores/:id` - Obtener un jugador por ID
- `POST /api/jugadores` - Crear un nuevo jugador
- `PUT /api/jugadores/:id` - Actualizar un jugador
- `DELETE /api/jugadores/:id` - Eliminar un jugador

## 🧪 Pruebas con Postman

Se puede importar la colección de Postman desde:
- Archivo: `Back-end/Postman_Collection_Equipos_Jugadores.json`

## 📊 Modelo de Base de Datos

### Tabla: equipos
- id (PK, AUTO_INCREMENT)
- nombre (VARCHAR, UNIQUE)
- ciudad (VARCHAR)
- estadio (VARCHAR)
- fundacion (INTEGER)
- escudo (VARCHAR)
- entrenador (VARCHAR)
- activo (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)

### Tabla: jugadores
- id (PK, AUTO_INCREMENT)
- nombre (VARCHAR)
- apellido (VARCHAR)
- fechaNacimiento (DATE)
- nacionalidad (VARCHAR)
- posicion (ENUM: portero, defensa, mediocampista, delantero)
- numeroCamiseta (INTEGER)
- foto (VARCHAR)
- equipoId (FK → equipos.id)
- activo (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)

## ✨ Funcionalidades Destacadas

1. **Validación de Datos**: Validaciones tanto en frontend como backend
2. **Eliminación Lógica**: Los registros se marcan como inactivos en lugar de eliminarse
3. **Control de Integridad**: No se puede eliminar un equipo con jugadores activos
4. **Números Únicos**: Control de números de camiseta únicos por equipo
5. **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos
6. **Feedback Visual**: Notificaciones toast para todas las operaciones

## 👥 Autor

Desarrollado como proyecto de evaluación para Programación Web Avanzada

## 📝 Licencia

Este proyecto es de uso educativo.
