# 🚗 Sistema de Cotización de Seguros Vehiculares

Sistema completo de gestión de seguros vehiculares con backend REST API (Node.js + Express + MySQL) y frontend interactivo (Next.js + PrimeReact).

![Estado del Proyecto](https://img.shields.io/badge/Estado-Producción-success)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![MySQL](https://img.shields.io/badge/MySQL-v5.7+-blue)
![Next.js](https://img.shields.io/badge/Next.js-13.4-black)

---

## 📖 Índice

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Rápida](#-instalación-rápida)
- [Documentación](#-documentación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación

- Login con JWT (tokens válidos por 24h)
- Roles de usuario: **ADMIN** y **OPERADOR**
- Protección de rutas en frontend y backend
- Gestión completa de usuarios (solo ADMIN)

### 📊 Gestión de Seguros

- **Conductores**: CRUD completo con validación de edad y duplicados
- **Vehículos**: Gestión con validación de antigüedad (máx. 20 años)
- **Cotizaciones**: Calculadora automática con reglas de negocio
- **Pagos**: Procesamiento con reintentos y múltiples modalidades

### 🎨 Interfaz Moderna

- Dashboard con estadísticas en tiempo real
- Diseño responsivo y profesional
- Validaciones en tiempo real
- Mensajes de error descriptivos
- Tablas interactivas con búsqueda y filtros

### 💰 Cálculo de Cotizaciones

El sistema aplica automáticamente:

- ✅ Descuento 10% sin accidentes
- 📈 Recargo 25% conductor joven (18-24 años)
- 📈 Recargo 15% mayor de 65 años
- 📈 Recargo 20% uso comercial
- 📈 Recargo 10% por accidente
- 📈 Recargo 50% más de 3 accidentes
- 💵 Costo base según tipo de vehículo (SEDAN/SUV/CAMIONETA)
- 💵 Factor del 2% del valor del vehículo

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** + **Express.js** - Servidor y API REST
- **Sequelize ORM** - Modelado de base de datos
- **MySQL** - Base de datos relacional
- **bcryptjs** - Hash seguro de contraseñas
- **jsonwebtoken** - Autenticación con JWT
- **dotenv** - Gestión de variables de entorno

### Frontend

- **Next.js 13.4** - Framework React con SSR
- **TypeScript** - Tipado estático
- **PrimeReact** - Componentes UI profesionales
- **Axios** - Cliente HTTP con interceptores
- **React Context API** - Estado global de autenticación

---

## 🚀 Instalación Rápida

### Requisitos

- Node.js v14+
- MySQL v5.7+
- pnpm (recomendado) o npm

### Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd Laboratorio2.2

# 2. Configurar base de datos MySQL
mysql -u root -p < seguro-vehicular-orm/database.sql

# 3. Instalar y configurar backend
cd seguro-vehicular-orm
pnpm install
# Editar .env con tus credenciales de MySQL
node src/scripts/crearUsuarioAdmin.js
node app.js

# 4. En otra terminal, instalar y ejecutar frontend
cd ../Front\ Taller
pnpm install
pnpm dev
```

### Acceso

- **URL:** http://localhost:3001
- **Usuario:** `admin`
- **Contraseña:** `admin123`

📚 **Para una guía detallada paso a paso:** Ver [INSTALACION.md](./INSTALACION.md)

---

## 📚 Documentación

- **[INSTALACION.md](./INSTALACION.md)** - Guía completa de instalación paso a paso
- **[seguro-vehicular-orm/README.md](./seguro-vehicular-orm/README.md)** - Documentación técnica del API
- **[database.sql](./seguro-vehicular-orm/database.sql)** - Schema completo de la base de datos

### Endpoints Principales

#### Autenticación

```
POST   /api/auth/login           - Iniciar sesión
POST   /api/auth/verificar       - Verificar token
GET    /api/auth/perfil          - Obtener perfil del usuario
```

#### Gestión (requiere autenticación)

```
GET/POST/PUT/DELETE   /api/conductores    - Gestión de conductores
GET/POST/PUT/DELETE   /api/vehiculos      - Gestión de vehículos
POST                  /api/cotizaciones/calcular - Calcular cotización
GET                   /api/cotizaciones   - Listar cotizaciones
POST                  /api/pagos/procesar - Procesar pago
POST                  /api/pagos/reintentar/:id - Reintentar pago fallido
```

#### Administración (requiere rol ADMIN)

```
GET/POST/PUT/DELETE   /api/auth/usuarios  - Gestión de usuarios
```

---

## 📁 Estructura del Proyecto

```
Laboratorio2.2/
│
├── 📄 INSTALACION.md                    # Guía de instalación paso a paso
├── 📄 README.md                         # Este archivo
│
├── 📂 seguro-vehicular-orm/             # 🔧 BACKEND (Puerto 3000)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # Configuración Sequelize + MySQL
│   │   ├── models/
│   │   │   ├── conductor.js             # Modelo Conductor
│   │   │   ├── vehiculo.js              # Modelo Vehículo
│   │   │   ├── cotizacion.js            # Modelo Cotización
│   │   │   ├── pago.js                  # Modelo Pago
│   │   │   └── usuario.js               # Modelo Usuario (Auth)
│   │   ├── controllers/
│   │   │   ├── authController.js        # Lógica de autenticación
│   │   │   ├── conductorController.js   # CRUD Conductores
│   │   │   ├── vehiculoController.js    # CRUD Vehículos
│   │   │   ├── cotizacionController.js  # Cálculo de cotizaciones
│   │   │   └── pagoController.js        # Procesamiento de pagos
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # Rutas de autenticación
│   │   │   ├── conductorRoutes.js       # Rutas de conductores
│   │   │   ├── vehiculoRoutes.js        # Rutas de vehículos
│   │   │   ├── cotizacionRoutes.js      # Rutas de cotizaciones
│   │   │   └── pagoRoutes.js            # Rutas de pagos
│   │   ├── middleware/
│   │   │   └── auth.js                  # Middleware JWT + Roles
│   │   └── scripts/
│   │       └── crearUsuarioAdmin.js     # Script inicial de usuario
│   ├── .env                             # Variables de entorno
│   ├── app.js                           # Punto de entrada del servidor
│   ├── database.sql                     # Schema completo + datos de prueba
│   ├── package.json                     # Dependencias del backend
│   └── README.md                        # Documentación técnica del API
│
└── 📂 Front Taller/                     # 🎨 FRONTEND (Puerto 3001)
    ├── app/
    │   ├── (main)/                      # Rutas protegidas por auth
    │   │   ├── page.tsx                 # 📊 Dashboard principal
    │   │   └── seguros/
    │   │       ├── conductores/         # Gestión de conductores
    │   │       ├── vehiculos/           # Gestión de vehículos
    │   │       ├── cotizacion/          # Calculadora de cotizaciones
    │   │       ├── historial/           # Historial de cotizaciones
    │   │       ├── pagos/               # Gestión de pagos
    │   │       └── usuarios/            # Administración de usuarios
    │   ├── (full-page)/
    │   │   └── auth/
    │   │       └── login/               # 🔐 Página de inicio de sesión
    │   └── layout.tsx                   # Layout principal con AuthProvider
    ├── components/
    │   └── PrivateRoute.tsx             # HOC para protección de rutas
    ├── context/
    │   └── AuthContext.tsx              # Estado global de autenticación
    ├── services/
    │   └── apiService.ts                # Cliente Axios + Interceptores
    ├── layout/                          # Componentes de layout (menú, topbar)
    ├── styles/                          # Estilos SCSS
    ├── public/                          # Archivos estáticos
    ├── package.json                     # Dependencias del frontend
    └── next.config.js                   # Configuración de Next.js
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Módulo de Conductores

- Crear, editar, listar y eliminar conductores
- Validación de edad (18-75 años)
- Detección de identificaciones duplicadas
- Registro de número de accidentes
- Cálculo automático de edad

### ✅ Módulo de Vehículos

- CRUD completo de vehículos
- Validación de antigüedad (máximo 20 años)
- Tipos: SEDAN, SUV, CAMIONETA, OTRO
- Uso: PERSONAL, COMERCIAL
- Detección de placas duplicadas

### ✅ Módulo de Cotizaciones

- Calculadora interactiva
- Selección de conductor y vehículo
- Cálculo automático con todas las reglas de negocio
- Desglose detallado de costos
- Tabla de referencia de porcentajes
- Historial con filtros por estado, conductor y fechas
- Estados: PENDIENTE, APROBADA, RECHAZADA, VENCIDA
- Vigencia de 30 días

### ✅ Módulo de Pagos

- Procesamiento de pagos (simulado al 90% de éxito)
- Tipos de tarjeta: CRÉDITO, DÉBITO
- Modalidades: CONTADO, DIFERIDO
- Pago en cuotas con recargo
- Reintentos de pagos fallidos
- Estados: EXITOSO, FALLIDO, PENDIENTE

### ✅ Módulo de Autenticación

- Sistema de login con JWT
- Tokens con expiración de 24 horas
- Dos roles: ADMIN y OPERADOR
- Protección de rutas frontend y backend
- Interceptor automático de tokens

### ✅ Módulo de Administración

- Gestión completa de usuarios (solo ADMIN)
- Crear, editar, eliminar usuarios
- Asignar roles (ADMIN/OPERADOR)
- Activar/desactivar usuarios
- Cambio de contraseñas
- Validación de duplicados (username y email)

### ✅ Dashboard

- Total de cotizaciones
- Ingresos totales
- Número de conductores
- Número de vehículos
- Gráfico de cotizaciones por estado
- Resumen de pagos
- Lista de cotizaciones recientes

---

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con **bcrypt** (10 salt rounds)
- ✅ Tokens JWT con expiración configurable (24h por defecto)
- ✅ Middleware de autenticación en todas las rutas protegidas
- ✅ Middleware de autorización por roles
- ✅ Interceptor de Axios para inyección automática de tokens
- ✅ Validación de token en cada recarga de página
- ✅ Protección de rutas frontend con `PrivateRoute`
- ✅ Menú condicional según rol del usuario
- ✅ Prevención de eliminación de cuenta propia

---

## 📸 Capturas de Pantalla

### 🔐 Página de Login

Sistema de autenticación con validación de credenciales.

### 📊 Dashboard Principal

Vista general con estadísticas, gráficos y resumen de cotizaciones recientes.

### 👤 Gestión de Conductores

Lista completa con búsqueda, filtros y formularios de creación/edición.

### 🚗 Gestión de Vehículos

CRUD de vehículos con validaciones de antigüedad y duplicados.

### 💰 Calculadora de Cotizaciones

Interfaz interactiva con selección de conductor/vehículo y cálculo automático.

### 📋 Historial de Cotizaciones

Vista detallada de todas las cotizaciones con filtros avanzados.

### 💳 Gestión de Pagos

Lista de pagos con opciones de reintentar y estados visuales.

### 👥 Administración de Usuarios (Solo ADMIN)

Panel de gestión de usuarios con roles y permisos.

---

## 🧪 Datos de Prueba

El sistema incluye datos de prueba precargados:

### Conductores

- **Abner Arboleda** (29 años, 0 accidentes) - Riesgo estándar
- **María González** (23 años, 1 accidente) - Conductor joven
- **Carlos Ramírez** (44 años, 0 accidentes) - Riesgo estándar
- **Ana Martínez** (67 años, 2 accidentes) - Mayor de 65
- **Luis Torres** (34 años, 4 accidentes) - Alto riesgo

### Vehículos

- **Toyota Fortuner 2022** (SUV, Personal)
- **Chevrolet Sail 2020** (Sedan, Personal)
- **Nissan Navara 2019** (Camioneta, Comercial)
- **Mazda CX-5 2021** (SUV, Personal)
- **Hyundai Accent 2018** (Sedan, Personal)

---

## 🚀 Despliegue a Producción

### Variables de Entorno Importantes

Para producción, actualiza las siguientes variables:

```env
# Backend (.env)
DB_HOST=tu_servidor_mysql
DB_USER=usuario_produccion
DB_PASSWORD=contraseña_segura
JWT_SECRET=clave_super_secreta_cambiar_en_produccion
NODE_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Recomendaciones de Seguridad

1. ✅ Cambiar `JWT_SECRET` a un valor único y seguro
2. ✅ Usar HTTPS en producción
3. ✅ Cambiar contraseña del usuario `admin` después del primer login
4. ✅ Habilitar rate limiting en el API
5. ✅ Usar variables de entorno para credenciales
6. ✅ Implementar logs de auditoría
7. ✅ Configurar CORS apropiadamente

---

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
