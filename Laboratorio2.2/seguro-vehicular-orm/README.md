# 🚗 Sistema de Cotización de Seguro Vehicular

Sistema completo de gestión de seguros vehiculares con API REST, autenticación JWT, frontend interactivo y todas las reglas de negocio implementadas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Reglas de Negocio Implementadas](#reglas-de-negocio-implementadas)
- [Requisitos](#requisitos)
- [Instalación Rápida](#instalación-rápida)
- [Arquitectura](#arquitectura)
- [Endpoints del API](#endpoints-del-api)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

### Backend (API REST)

- ✅ Gestión completa de conductores con validación de edad
- ✅ Gestión de vehículos con validación de antigüedad
- ✅ Cálculo automático de cotizaciones con múltiples factores
- ✅ Procesamiento de pagos con diferentes modalidades
- ✅ Sistema de descuentos y recargos
- ✅ Validación de vigencia de cotizaciones
- ✅ Manejo de estados de transacciones
- ✅ **Sistema de autenticación JWT**
- ✅ **Gestión de usuarios con roles (ADMIN/OPERADOR)**
- ✅ **Middleware de autorización**

### Frontend (Next.js + PrimeReact)

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión visual de conductores y vehículos
- ✅ Calculadora de cotizaciones interactiva
- ✅ Historial de cotizaciones con filtros
- ✅ Gestión de pagos con reintentos
- ✅ **Sistema de login con protección de rutas**
- ✅ **Panel de administración de usuarios (solo ADMIN)**
- ✅ **Interfaz moderna y responsiva**
- ✅ **Validaciones en tiempo real**
- ✅ **Mensajes de error amigables**

## 🛠️ Tecnologías

### Backend

- **Node.js** + **Express.js** - Servidor y API REST
- **Sequelize ORM** - Modelado de datos
- **MySQL** - Base de datos relacional
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **dotenv** - Variables de entorno

### Frontend

- **Next.js 13.4** - Framework React
- **TypeScript** - Tipado estático
- **PrimeReact** - Componentes UI
- **Axios** - Cliente HTTP
- **React Context API** - Estado global

## 📜 Reglas de Negocio Implementadas

### 🧑 Reglas sobre el Conductor

- ❌ **Menor de 18 años**: NO se permite generar cotización
- 💰 **18-24 años**: Recargo del 25% por conductor joven
- ✅ **25-65 años**: Riesgo estándar (sin recargo)
- 💰 **Mayor de 65 años**: Recargo del 15% por edad avanzada
- ❌ **Mayor de 75 años**: Cotización rechazada automáticamente

### 🚗 Reglas sobre el Vehículo

- 💵 **Sedán**: Costo base $300
- 💵 **SUV/Camioneta**: Costo base $450 (incrementado)
- 💰 **Uso comercial**: Recargo obligatorio del 20%
- ❌ **Más de 20 años**: No se puede cotizar
- 📈 **Valor del vehículo**: Influye en el costo (2% del valor)

### 📊 Reglas sobre Historial de Accidentes

- ✅ **Sin accidentes**: Descuento del 10%
- 💰 **1-3 accidentes**: Recargo del 10% por cada accidente
- 🚨 **Más de 3 accidentes**: Recargo del 50% (alto riesgo)

### 💳 Reglas sobre Forma de Pago

- ✅ **Tarjeta de crédito + pago anual**: Descuento del 5%
- ⚡ **Tarjeta de débito**: Activación inmediata si se aprueba
- 💰 **Pago en cuotas**: Incremento del 3% por cada cuota adicional
- ⏸️ **Pago fallido**: Cotización queda en estado PENDIENTE

### 📅 Reglas Generales

- ⏰ **Vigencia**: 30 días desde la creación
- 📝 **Registro**: Todas las cotizaciones quedan registradas
- ❌ **Cotización vencida**: No puede convertirse en póliza
- ✍️ **Términos y condiciones**: Aceptación obligatoria

## 🔧 Requisitos

- **Node.js** v14 o superior
- **MySQL** v5.7 o superior
- **pnpm** o npm
- Puerto 3000 disponible (backend)
- Puerto 3001 disponible (frontend)

## 🚀 Instalación Rápida

Para una guía detallada paso a paso, consulta [INSTALACION.md](./INSTALACION.md)

```bash
# 1. Instalar dependencias del backend
cd seguro-vehicular-orm
pnpm install

# 2. Configurar base de datos (ver INSTALACION.md)
# 3. Crear usuario administrador
node src/scripts/crearUsuarioAdmin.js

# 4. Iniciar backend
node app.js

# 5. En otra terminal, instalar y ejecutar frontend
cd ../Front\ Taller
pnpm install
pnpm dev
```

Accede a: **http://localhost:3001**  
Credenciales: `admin` / `admin123`

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │  HTTP   │   Backend API   │  SQL    │     MySQL       │
│   Next.js       │ ◄─────► │   Express.js    │ ◄─────► │   Database      │
│   (Port 3001)   │  JWT    │   (Port 3000)   │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 📡 Endpoints del API

### 🧑 Conductores

| Método | Endpoint               | Descripción                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/conductores`     | Crear conductor              |
| GET    | `/api/conductores`     | Listar todos los conductores |
| GET    | `/api/conductores/:id` | Obtener conductor por ID     |
| PUT    | `/api/conductores/:id` | Actualizar conductor         |
| DELETE | `/api/conductores/:id` | Eliminar conductor           |

### 🚗 Vehículos

| Método | Endpoint             | Descripción                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/vehiculos`     | Crear vehículo             |
| GET    | `/api/vehiculos`     | Listar todos los vehículos |
| GET    | `/api/vehiculos/:id` | Obtener vehículo por ID    |
| PUT    | `/api/vehiculos/:id` | Actualizar vehículo        |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo          |

### 📊 Cotizaciones

| Método | Endpoint                          | Descripción                   |
| ------ | --------------------------------- | ----------------------------- |
| POST   | `/api/cotizaciones/calcular`      | Calcular nueva cotización     |
| GET    | `/api/cotizaciones`               | Listar todas las cotizaciones |
| GET    | `/api/cotizaciones/:id`           | Obtener cotización por ID     |
| PUT    | `/api/cotizaciones/:id/estado`    | Actualizar estado             |
| DELETE | `/api/cotizaciones/:id`           | Eliminar cotización           |
| GET    | `/api/cotizaciones/conductor/:id` | Cotizaciones por conductor    |

### 💳 Pagos

| Método | Endpoint                    | Descripción             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/pagos/procesar`       | Procesar pago           |
| GET    | `/api/pagos`                | Listar todos los pagos  |
| GET    | `/api/pagos/:id`            | Obtener pago por ID     |
| GET    | `/api/pagos/cotizacion/:id` | Pagos por cotización    |
| POST   | `/api/pagos/reintentar/:id` | Reintentar pago fallido |
| DELETE | `/api/pagos/:id`            | Eliminar pago           |

### 🔐 Autenticación

| Método | Endpoint              | Descripción                  | Auth Required |
| ------ | --------------------- | ---------------------------- | ------------- |
| POST   | `/api/auth/login`     | Iniciar sesión (obtener JWT) | No            |
| POST   | `/api/auth/verificar` | Verificar validez del token  | No            |
| GET    | `/api/auth/perfil`    | Obtener perfil del usuario   | Sí            |

### 👥 Gestión de Usuarios (Solo ADMIN)

| Método | Endpoint                 | Descripción               | Auth Required | Role Required |
| ------ | ------------------------ | ------------------------- | ------------- | ------------- |
| GET    | `/api/auth/usuarios`     | Listar todos los usuarios | Sí            | ADMIN         |
| GET    | `/api/auth/usuarios/:id` | Obtener usuario por ID    | Sí            | ADMIN         |
| POST   | `/api/auth/usuarios`     | Crear nuevo usuario       | Sí            | ADMIN         |
| PUT    | `/api/auth/usuarios/:id` | Actualizar usuario        | Sí            | ADMIN         |
| DELETE | `/api/auth/usuarios/:id` | Eliminar usuario          | Sí            | ADMIN         |

## 🔐 Autenticación y Autorización

### Sistema de Roles

El sistema implementa dos roles de usuario:

- **ADMIN**: Acceso completo al sistema, puede gestionar usuarios
- **OPERADOR**: Puede gestionar conductores, vehículos, cotizaciones y pagos

### Flujo de Autenticación

1. **Login**: POST `/api/auth/login` con `username` y `password`

   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Respuesta**: Token JWT válido por 24 horas

   ```json
   {
     "mensaje": "Login exitoso",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "usuario": {
       "id_usuario": 1,
       "username": "admin",
       "nombre_completo": "Administrador del Sistema",
       "email": "admin@seguros.com",
       "rol": "ADMIN"
     }
   }
   ```

3. **Uso del Token**: Incluir en el header `Authorization: Bearer {token}` en todas las peticiones protegidas

### Protección de Rutas (Frontend)

- Todas las rutas principales están protegidas con `PrivateRoute`
- Redirección automática a `/auth/login` si no está autenticado
- El menú de "Administración" solo es visible para usuarios ADMIN
- Validación de token en cada recarga de página

## 💡 Ejemplos de Uso

### 1. Crear un Conductor

```json
POST /api/conductores
{
  "identificacion": "1717171717",
  "nombre_completo": "Abner Arboleda",
  "fecha_nacimiento": "1995-05-15",
  "email": "abner@ejemplo.com",
  "numero_accidentes": 0
}
```

**Respuesta:**

```json
{
  "mensaje": "Conductor registrado exitosamente",
  "conductor": {
    "id_conductor": 1,
    "identificacion": "1717171717",
    "nombre_completo": "Abner Arboleda",
    "fecha_nacimiento": "1995-05-15",
    "email": "abner@ejemplo.com",
    "numero_accidentes": 0
  },
  "edad_calculada": 29
}
```

### 2. Crear un Vehículo

```json
POST /api/vehiculos
{
  "marca": "Toyota",
  "modelo": "Fortuner",
  "anio_fabricacion": 2022,
  "placa": "PBA-1234",
  "valor_mercado": 45000.00,
  "tipo_vehiculo": "SUV",
  "uso_vehiculo": "PERSONAL"
}
```

**Respuesta:**

```json
{
  "mensaje": "Vehículo registrado exitosamente",
  "notas": ["Costo base incrementado por tipo de vehículo"],
  "vehiculo": {
    "id_vehiculo": 1,
    "marca": "Toyota",
    "modelo": "Fortuner",
    "anio_fabricacion": 2022,
    "placa": "PBA-1234",
    "valor_mercado": "45000.00",
    "tipo_vehiculo": "SUV",
    "uso_vehiculo": "PERSONAL"
  },
  "antiguedad": 3
}
```

### 3. Calcular Cotización

```json
POST /api/cotizaciones/calcular
{
  "id_conductor": 1,
  "id_vehiculo": 1,
  "acepta_terminos": true
}
```

**Respuesta:**

```json
{
  "mensaje": "Cotización calculada exitosamente",
  "cotizacion": {
    "id_cotizacion": 1,
    "id_conductor": 1,
    "id_vehiculo": 1,
    "fecha_vencimiento": "2025-01-11T12:00:00.000Z",
    "monto_base": "1350.00",
    "monto_recargos": "0.00",
    "monto_descuentos": "135.00",
    "monto_total": "1215.00",
    "estado": "APROBADA",
    "acepta_terminos": true
  },
  "detalleCalculo": [
    {
      "concepto": "Descuento por buen historial (sin accidentes)",
      "monto": "-135.00"
    }
  ],
  "informacion": {
    "conductor": {
      "nombre": "Abner Arboleda",
      "edad": 29,
      "accidentes": 0
    },
    "vehiculo": {
      "marca": "Toyota",
      "modelo": "Fortuner",
      "tipo": "SUV",
      "uso": "PERSONAL",
      "antiguedad": 3
    },
    "vigencia": {
      "desde": "2024-12-12",
      "hasta": "2025-01-11",
      "dias": 30
    }
  }
}
```

### 4. Procesar Pago

```json
POST /api/pagos/procesar
{
  "id_cotizacion": 1,
  "tipo_tarjeta": "CREDITO",
  "modalidad_pago": "CONTADO",
  "numero_cuotas": 1,
  "codigo_referencia_pasarela": "ABC123XYZ"
}
```

**Respuesta (si es exitoso):**

```json
{
  "mensaje": "Pago procesado exitosamente",
  "pago": {
    "id_pago": 1,
    "id_cotizacion": 1,
    "tipo_tarjeta": "CREDITO",
    "modalidad_pago": "CONTADO",
    "numero_cuotas": 1,
    "monto_pagado": "1154.25",
    "estado_transaccion": "EXITOSO",
    "codigo_referencia_pasarela": "ABC123XYZ"
  },
  "detallesPago": [
    {
      "concepto": "Descuento por pago anual con tarjeta de crédito",
      "monto": "-60.75"
    }
  ],
  "poliza": {
    "estado": "EMITIDA",
    "mensaje": "Póliza emitida inmediatamente"
  }
}
```

## 🎯 Casos de Validación

### ❌ Conductor menor de 18 años

```json
POST /api/conductores
{
  "identificacion": "1234567890",
  "nombre_completo": "Juan Pérez",
  "fecha_nacimiento": "2010-01-01",
  "email": "juan@ejemplo.com"
}
```

**Respuesta:**

```json
{
  "error": "El conductor debe ser mayor de 18 años",
  "edad_actual": 14
}
```

### ❌ Vehículo con más de 20 años

```json
POST /api/vehiculos
{
  "marca": "Chevrolet",
  "modelo": "Aveo",
  "anio_fabricacion": 2000,
  "valor_mercado": 3000,
  "tipo_vehiculo": "SEDAN",
  "uso_vehiculo": "PERSONAL"
}
```

**Respuesta:**

```json
{
  "error": "El vehículo tiene 25 años. No se permite cotizar vehículos con más de 20 años.",
  "antiguedad": 25
}
```

### ❌ Cotización sin aceptar términos

```json
POST /api/cotizaciones/calcular
{
  "id_conductor": 1,
  "id_vehiculo": 1,
  "acepta_terminos": false
}
```

**Respuesta:**

```json
{
  "error": "Debe aceptar los términos y condiciones para generar la cotización"
}
```

## 🗂️ Estructura del Proyecto

```
Laboratorio2.2/
├── seguro-vehicular-orm/          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Configuración Sequelize
│   │   ├── models/
│   │   │   ├── conductor.js       # Modelo Conductor
│   │   │   ├── vehiculo.js        # Modelo Vehículo
│   │   │   ├── cotizacion.js      # Modelo Cotización
│   │   │   ├── pago.js            # Modelo Pago
│   │   │   └── usuario.js         # Modelo Usuario (nuevo)
│   │   ├── controllers/
│   │   │   ├── conductorController.js     # CRUD Conductores
│   │   │   ├── vehiculoController.js      # CRUD Vehículos
│   │   │   ├── cotizacionController.js    # Lógica Cotizaciones
│   │   │   ├── pagoController.js          # Procesamiento Pagos
│   │   │   └── authController.js          # Autenticación (nuevo)
│   │   ├── routes/
│   │   │   ├── conductorRoutes.js
│   │   │   ├── vehiculoRoutes.js
│   │   │   ├── cotizacionRoutes.js
│   │   │   ├── pagoRoutes.js
│   │   │   └── authRoutes.js              # Rutas Auth (nuevo)
│   │   ├── middleware/
│   │   │   └── auth.js                    # Middleware JWT (nuevo)
│   │   └── scripts/
│   │       └── crearUsuarioAdmin.js       # Script inicial (nuevo)
│   ├── .env                               # Variables de entorno
│   ├── app.js                             # Punto de entrada
│   ├── database.sql                       # Schema completo
│   └── package.json
│
└── Front Taller/                  # Frontend Next.js
    ├── app/
    │   ├── (main)/                        # Rutas protegidas
    │   │   ├── page.tsx                   # Dashboard
    │   │   └── seguros/
    │   │       ├── conductores/           # Gestión conductores
    │   │       ├── vehiculos/             # Gestión vehículos
    │   │       ├── cotizacion/            # Calculadora
    │   │       ├── historial/             # Historial cotizaciones
    │   │       ├── pagos/                 # Gestión pagos
    │   │       └── usuarios/              # Admin usuarios (nuevo)
    │   ├── (full-page)/
    │   │   └── auth/
    │   │       └── login/                 # Página login (nuevo)
    │   └── layout.tsx                     # Layout principal
    ├── components/
    │   └── PrivateRoute.tsx               # HOC protección (nuevo)
    ├── context/
    │   └── AuthContext.tsx                # Estado auth (nuevo)
    ├── services/
    │   └── apiService.ts                  # Cliente API + Auth
    ├── layout/                            # Componentes layout
    └── package.json
```

## 🎨 Capturas del Sistema

### Dashboard Principal

- Estadísticas en tiempo real
- Gráficos de cotizaciones y pagos
- Resumen de conductores y vehículos

### Gestión de Conductores

- Lista con búsqueda y filtros
- Formulario de creación/edición
- Validación de edad y duplicados

### Gestión de Vehículos

- CRUD completo
- Validación de antigüedad
- Cálculo automático de años

### Calculadora de Cotizaciones

- Selección de conductor y vehículo
- Cálculo automático con desglose
- Tabla de referencia de porcentajes

### Historial de Cotizaciones

- Filtros por estado, conductor y fechas
- Vista detallada de cada cotización
- Estado visual con badges

### Gestión de Pagos

- Lista de todos los pagos
- Reintento de pagos fallidos
- Estados visuales (EXITOSO/FALLIDO/PENDIENTE)

### Administración de Usuarios (Solo ADMIN)

- CRUD de usuarios
- Asignación de roles
- Estado activo/inactivo

## 📝 Notas Importantes

### Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ Tokens JWT con expiración de 24 horas
- ✅ Validación de roles en backend
- ✅ Protección de rutas en frontend
- ✅ Interceptor de Axios para tokens automáticos

### Base de Datos

- La sincronización es automática con `sequelize.sync({ alter: true })`
- En producción, usar migraciones para mayor control
- Los timestamps son manejados manualmente donde sea necesario
- Las relaciones entre tablas usan ON DELETE CASCADE/RESTRICT según el caso

### Estados del Sistema

**Cotizaciones:**

- `PENDIENTE`: Creada, esperando pago
- `APROBADA`: Lista para procesar pago
- `RECHAZADA`: No cumple requisitos
- `VENCIDA`: Superó 30 días

**Pagos:**

- `EXITOSO`: Pago completado
- `FALLIDO`: Error en procesamiento
- `PENDIENTE`: En espera de confirmación

**Usuarios:**

- `activo: true`: Puede iniciar sesión
- `activo: false`: Cuenta deshabilitada

### Mejoras Implementadas

1. ✅ Sistema de autenticación completo
2. ✅ Gestión de usuarios con roles
3. ✅ Dashboard con métricas del negocio
4. ✅ Validación de duplicados (identificación/placa/username/email)
5. ✅ Mensajes de error descriptivos
6. ✅ Tabla de porcentajes de cálculo
7. ✅ Reintentos de pagos fallidos (actualiza en lugar de duplicar)
8. ✅ Frontend totalmente funcional e integrado

## 🤝 Contribuciones

Este proyecto fue desarrollado siguiendo las especificaciones funcionales del módulo de cotización de seguro vehicular, con mejoras adicionales en UX, seguridad y arquitectura.

## 📄 Licencia

ISC

---

**Desarrollado por:** Abner Arboleda  
**Fecha:** Diciembre 2024  
**Última actualización:** 13 de Diciembre, 2025
