# 🚗 Sistema de Cotización de Seguro Vehicular

API REST completa para el cálculo y gestión de cotizaciones de seguros vehiculares con todas las reglas de negocio implementadas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Reglas de Negocio Implementadas](#reglas-de-negocio-implementadas)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints del API](#endpoints-del-api)
- [Ejemplos de Uso](#ejemplos-de-uso)

## ✨ Características

- ✅ Gestión completa de conductores con validación de edad
- ✅ Gestión de vehículos con validación de antigüedad
- ✅ Cálculo automático de cotizaciones con múltiples factores
- ✅ Procesamiento de pagos con diferentes modalidades
- ✅ Sistema de descuentos y recargos
- ✅ Validación de vigencia de cotizaciones
- ✅ Manejo de estados de transacciones

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

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o pnpm

## 📦 Instalación

```bash
# Clonar o descargar el proyecto
cd seguro-vehicular-orm

# Instalar dependencias
npm install
# o
pnpm install
```

## ⚙️ Configuración

1. Crear la base de datos MySQL ejecutando el script SQL proporcionado:

```sql
CREATE DATABASE IF NOT EXISTS SegurosVehiculares;
USE SegurosVehiculares;
```

2. Configurar el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=3096
DB_USER=root
DB_PASSWORD=
DB_NAME=SegurosVehiculares
DB_DIALECT=mysql
PORT=3000
```

3. El servidor creará automáticamente las tablas al iniciar.

## 🚀 Uso

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

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
seguro-vehicular-orm/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de Sequelize
│   ├── models/
│   │   ├── conductor.js         # Modelo Conductor
│   │   ├── vehiculo.js          # Modelo Vehículo
│   │   ├── cotizacion.js        # Modelo Cotización
│   │   └── pago.js              # Modelo Pago
│   ├── controllers/
│   │   ├── conductorController.js    # Lógica de conductores
│   │   ├── vehiculoController.js     # Lógica de vehículos
│   │   ├── cotizacionController.js   # Lógica de cotizaciones
│   │   └── pagoController.js         # Lógica de pagos
│   └── routes/
│       ├── conductorRoutes.js   # Rutas de conductores
│       ├── vehiculoRoutes.js    # Rutas de vehículos
│       ├── cotizacionRoutes.js  # Rutas de cotizaciones
│       └── pagoRoutes.js        # Rutas de pagos
├── .env                         # Variables de entorno
├── app.js                       # Punto de entrada
├── package.json                 # Dependencias
└── README.md                    # Este archivo
```

## 📝 Notas Importantes

1. **Base de datos**: Asegúrate de tener MySQL corriendo y la base de datos `SegurosVehiculares` creada.

2. **Sincronización**: El servidor usa `sequelize.sync({ alter: true })` para actualizar las tablas automáticamente. En producción, considera usar migraciones.

3. **Pagos simulados**: El procesamiento de pagos está simulado (90% de éxito). En producción, integrar con pasarela real.

4. **Vigencia**: Las cotizaciones tienen 30 días de vigencia. Después se marcan como VENCIDAS.

5. **Estados de cotización**:
   - `PENDIENTE`: Cotización creada, pendiente de pago
   - `APROBADA`: Cotización aprobada, puede procesarse pago
   - `RECHAZADA`: No cumple requisitos (edad, vehículo)
   - `VENCIDA`: Superó los 30 días de vigencia

## 🤝 Contribuciones

Este proyecto fue desarrollado siguiendo las especificaciones funcionales del módulo de cotización de seguro vehicular.

## 📄 Licencia

ISC

---

**Desarrollado por:** Abner Arboleda  
**Fecha:** Diciembre 2024
