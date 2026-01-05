# Frontend - Sistema de Gestión de Equipos y Jugadores

Aplicación React con Next.js y PrimeReact para gestionar equipos y jugadores.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## ▶️ Ejecutar

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 📁 Estructura

```
app/(main)/
├── equipos/page.jsx      # Gestión de equipos
├── jugadores/page.jsx    # Gestión de jugadores
└── page.tsx             # Dashboard

demo/
├── components/          # Componentes reutilizables
│   ├── EquipoForm.jsx
│   ├── EquipoTable.jsx
│   ├── JugadorForm.jsx
│   └── JugadorTable.jsx
└── service/            # Servicios API
    ├── equipoService.js
    └── jugadorService.js
```

## ✨ Características

- Gestión completa de equipos (CRUD)
- Gestión completa de jugadores (CRUD)
- Filtrado de jugadores por equipo
- Validación de formularios
- Notificaciones toast
- Diseño responsivo con PrimeReact
