# Sistema de Gestión de Equipos y Jugadores

Sistema web completo de gestión de equipos de fútbol y sus jugadores, implementando operaciones CRUD mediante una arquitectura cliente-servidor.

---

## Estructura del Proyecto

```
Laboratorio2.2/
├── Front Taller/              # Frontend Next.js + React + PrimeReact
│   ├── src/
│   │   ├── components/
│   │   │   ├── EquipoForm.jsx
│   │   │   ├── EquipoTable.jsx
│   │   │   ├── JugadorForm.jsx
│   │   │   └── JugadorTable.jsx
│   │   ├── pages/
│   │   │   ├── EquiposPage.jsx
│   │   │   └── JugadoresPage.jsx
│   │   └── services/
│   │       ├── equipoService.js
│   │       └── jugadorService.js
│   └── package.json
│
└── seguro-vehicular-orm/      # Backend Node.js/Express/Sequelize
    ├── src/
    │   ├── models/
    │   │   ├── equipo.js
    │   │   └── jugador.js
    │   ├── controllers/
    │   │   ├── equipoController.js
    │   │   └── jugadorController.js
    │   ├── routes/
    │   │   ├── equipoRoutes.js
    │   │   └── jugadorRoutes.js
    │   └── config/
    │       └── database.js
    ├── app.js
    └── package.json
```

## Endpoints API

### Equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/equipos` - Obtener todos los equipos
- `GET /api/equipos/:id` - Obtener equipo por ID
- `PUT /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo

### Jugadores
- `POST /api/jugadores` - Crear jugador
- `GET /api/jugadores` - Obtener todos los jugadores
- `GET /api/jugadores?equipoId=1` - Filtrar por equipo
- `GET /api/jugadores/:id` - Obtener jugador por ID
- `PUT /api/jugadores/:id` - Actualizar jugador
- `DELETE /api/jugadores/:id` - Eliminar jugador

## Características Implementadas

- ✅ Relación uno a muchos (Equipo → Jugadores)
- ✅ CRUD completo para ambas entidades
- ✅ Validaciones en servidor y cliente
- ✅ Componentes reutilizables con PrimeReact
- ✅ Servicios centralizados para API
- ✅ Notificaciones de usuario
- ✅ Diálogos de confirmación

## Instalación

### Backend
```bash
cd seguro-vehicular-orm
npm install
npm start
```

### Frontend
```bash
cd "Front Taller"
npm install
npm run dev
```

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte del curso de Desarrollo Web Avanzado, siguiendo las especificaciones funcionales del sistema de cotización de seguros vehiculares.

### Mejoras Futuras

- [ ] Integración con pasarela de pagos real
- [ ] Sistema de notificaciones por email
- [ ] Generación de PDFs de cotizaciones
- [ ] Reportes y estadísticas avanzadas
- [ ] Historial de cambios (auditoría)
- [ ] Exportación de datos a Excel/CSV
- [ ] Recuperación de contraseña
- [ ] Autenticación de dos factores (2FA)

---

## 📝 Licencia

ISC

---

## 👨‍💻 Autor

**Abner Arboleda**  
Desarrollo Web Avanzado  
Diciembre 2024

---

## 📞 Contacto y Soporte

Para preguntas, problemas o sugerencias:

- Ver [INSTALACION.md](./INSTALACION.md) para guía detallada
- Revisar [seguro-vehicular-orm/README.md](./seguro-vehicular-orm/README.md) para documentación técnica
- Consultar la sección de **Solución de Problemas** en INSTALACION.md

---

⭐ Si este proyecto te fue útil, dale una estrella en GitHub!
