# Backend - Sistema de Gestión de Equipos y Jugadores

API REST para la gestión de equipos deportivos y sus jugadores.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crear archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_equipos
PORT=3000
```

## 📦 Crear Base de Datos

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS gestion_equipos;"
```

## ▶️ Ejecutar

```bash
npm run dev
```

## 📍 Endpoints

### Equipos
- `GET /api/equipos` - Listar todos
- `GET /api/equipos/:id` - Obtener por ID
- `POST /api/equipos` - Crear
- `PUT /api/equipos/:id` - Actualizar
- `DELETE /api/equipos/:id` - Eliminar

### Jugadores
- `GET /api/jugadores` - Listar todos
- `GET /api/jugadores/equipo/:equipoId` - Por equipo
- `GET /api/jugadores/:id` - Obtener por ID
- `POST /api/jugadores` - Crear
- `PUT /api/jugadores/:id` - Actualizar
- `DELETE /api/jugadores/:id` - Eliminar

## 🧪 Probar con Postman

Importar: `Postman_Collection_Equipos_Jugadores.json`
