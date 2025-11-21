# Guía de Pruebas con Postman - Banco Peluche API

## 🌐 URL Base

```
http://localhost:3000/api/clientes
```

## 📋 Colección de Endpoints

### 1. Crear Cliente (POST)

**Endpoint**: `POST http://localhost:3000/api/clientes`

**Headers**:

```
Content-Type: application/json
```

**Body (JSON)**:

```json
{
  "nombre": "María García",
  "saldoAnterior": 2000,
  "montoCompras": 800,
  "pagoRealizado": 350
}
```

**Respuesta Exitosa (201)**:

```json
{
  "ok": true,
  "data": {
    "_id": "673e1234567890abcdef1234",
    "nombre": "María García",
    "saldoAnterior": 2000,
    "montoCompras": 800,
    "pagoRealizado": 350,
    "saldoBase": 2450,
    "pagoMinimoBase": 367.5,
    "esMoroso": true,
    "interes": 294,
    "multa": 200,
    "saldoActual": 2944,
    "pagoMinimo": 441.6,
    "pagoNoIntereses": 2502.4,
    "createdAt": "2025-11-20T...",
    "updatedAt": "2025-11-20T..."
  }
}
```

---

### 2. Obtener Todos los Clientes (GET)

**Endpoint**: `GET http://localhost:3000/api/clientes`

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "data": [
    {
      "_id": "673e1234567890abcdef1234",
      "nombre": "María García",
      "saldoActual": 2944,
      "esMoroso": true,
      "pagoMinimo": 441.6,
      ...
    },
    {
      "_id": "673e1234567890abcdef5678",
      "nombre": "Carlos López",
      "saldoActual": 1500,
      "esMoroso": false,
      "pagoMinimo": 225,
      ...
    }
  ]
}
```

---

### 3. Obtener Cliente por ID (GET)

**Endpoint**: `GET http://localhost:3000/api/clientes/:id`

**Ejemplo**: `GET http://localhost:3000/api/clientes/673e1234567890abcdef1234`

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "data": {
    "_id": "673e1234567890abcdef1234",
    "nombre": "María García",
    "saldoAnterior": 2000,
    "montoCompras": 800,
    "pagoRealizado": 350,
    "saldoBase": 2450,
    "pagoMinimoBase": 367.5,
    "esMoroso": true,
    "interes": 294,
    "multa": 200,
    "saldoActual": 2944,
    "pagoMinimo": 441.6,
    "pagoNoIntereses": 2502.4,
    "createdAt": "2025-11-20T...",
    "updatedAt": "2025-11-20T..."
  }
}
```

**Respuesta Error (404)**:

```json
{
  "ok": false,
  "msg": "Cliente no encontrado"
}
```

---

### 4. Actualizar Cliente (PUT)

**Endpoint**: `PUT http://localhost:3000/api/clientes/:id`

**Headers**:

```
Content-Type: application/json
```

**Body (JSON)**:

```json
{
  "nombre": "María García Pérez",
  "saldoAnterior": 2000,
  "montoCompras": 800,
  "pagoRealizado": 500
}
```

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "data": {
    "_id": "673e1234567890abcdef1234",
    "nombre": "María García Pérez",
    "saldoAnterior": 2000,
    "montoCompras": 800,
    "pagoRealizado": 500,
    "saldoBase": 2300,
    "pagoMinimoBase": 345,
    "esMoroso": false,
    "interes": 0,
    "multa": 0,
    "saldoActual": 2300,
    "pagoMinimo": 345,
    "pagoNoIntereses": 1955,
    ...
  }
}
```

---

### 5. Eliminar Cliente (DELETE)

**Endpoint**: `DELETE http://localhost:3000/api/clientes/:id`

**Ejemplo**: `DELETE http://localhost:3000/api/clientes/673e1234567890abcdef1234`

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "msg": "Cliente eliminado exitosamente"
}
```

---

### 6. Obtener Estadísticas (GET)

**Endpoint**: `GET http://localhost:3000/api/clientes/estadisticas`

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "data": {
    "total": 10,
    "morosos": 3,
    "noMorosos": 7
  }
}
```

---

### 7. Calcular sin Guardar (POST) - Legacy

**Endpoint**: `POST http://localhost:3000/api/clientes/calcular`

**Headers**:

```
Content-Type: application/json
```

**Body (JSON)**:

```json
{
  "saldoAnterior": 1000,
  "montoCompras": 500,
  "pagoRealizado": 100
}
```

**Respuesta Exitosa (200)**:

```json
{
  "ok": true,
  "data": {
    "saldoAnterior": 1000,
    "montoCompras": 500,
    "pagoRealizado": 100,
    "saldoBase": 1400,
    "pagoMinimoBase": 210,
    "esMoroso": true,
    "interes": 168,
    "multa": 200,
    "saldoActual": 1768,
    "pagoMinimo": 265.2,
    "pagoNoIntereses": 1502.8
  }
}
```

---

## 🧪 Casos de Prueba

### Caso 1: Cliente NO Moroso

**Datos**:

```json
{
  "nombre": "Juan Pérez",
  "saldoAnterior": 1000,
  "montoCompras": 500,
  "pagoRealizado": 300
}
```

**Cálculos**:

- Saldo Base = 1000 + 500 - 300 = 1200
- Pago Mínimo Base = 1200 × 0.15 = 180
- Es Moroso = 300 < 180 ? NO (300 >= 180)
- Interés = 0
- Multa = 0
- Saldo Actual = 1200
- Pago Mínimo = 1200 × 0.15 = 180
- Pago Sin Intereses = 1200 × 0.85 = 1020

---

### Caso 2: Cliente Moroso

**Datos**:

```json
{
  "nombre": "Ana Torres",
  "saldoAnterior": 2000,
  "montoCompras": 1000,
  "pagoRealizado": 300
}
```

**Cálculos**:

- Saldo Base = 2000 + 1000 - 300 = 2700
- Pago Mínimo Base = 2700 × 0.15 = 405
- Es Moroso = 300 < 405 ? SÍ
- Interés = 2700 × 0.12 = 324
- Multa = 200
- Saldo Actual = 2700 + 324 + 200 = 3224
- Pago Mínimo = 3224 × 0.15 = 483.6
- Pago Sin Intereses = 3224 × 0.85 = 2740.4

---

### Caso 3: Cliente con Saldo 0

**Datos**:

```json
{
  "nombre": "Luis Gómez",
  "saldoAnterior": 0,
  "montoCompras": 0,
  "pagoRealizado": 0
}
```

**Resultado**:

- Todo en 0, no es moroso

---

### Caso 4: Cliente Justo en el Límite

**Datos**:

```json
{
  "nombre": "Pedro Sánchez",
  "saldoAnterior": 1000,
  "montoCompras": 0,
  "pagoRealizado": 150
}
```

**Cálculos**:

- Saldo Base = 1000 + 0 - 150 = 850
- Pago Mínimo Base = 850 × 0.15 = 127.5
- Es Moroso = 150 < 127.5 ? NO (150 >= 127.5)
- No hay cargos adicionales

---

## 📥 Importar a Postman

### Opción 1: Colección Manual

1. Crear nueva colección "Banco Peluche API"
2. Agregar cada endpoint manualmente
3. Configurar variables de entorno:
   - `base_url`: `http://localhost:3000/api/clientes`

### Opción 2: Variables de Entorno Sugeridas

```json
{
  "base_url": "http://localhost:3000/api/clientes",
  "cliente_id": "{{id_del_cliente}}"
}
```

Usar como: `{{base_url}}/{{cliente_id}}`

---

## 🔍 Verificaciones Importantes

### ✅ Checklist de Pruebas

- [ ] Crear cliente con datos válidos
- [ ] Crear cliente sin nombre (debe fallar con 400)
- [ ] Obtener lista vacía de clientes
- [ ] Obtener lista con clientes
- [ ] Obtener cliente existente por ID
- [ ] Obtener cliente inexistente por ID (debe dar 404)
- [ ] Actualizar cliente existente
- [ ] Actualizar cliente inexistente (debe dar 404)
- [ ] Eliminar cliente existente
- [ ] Eliminar cliente inexistente (debe dar 404)
- [ ] Obtener estadísticas con clientes
- [ ] Obtener estadísticas sin clientes
- [ ] Calcular sin guardar (legacy endpoint)

---

## 🚨 Errores Comunes

### Error 500: Cannot read property '...'

**Causa**: El servidor no está corriendo
**Solución**: `cd banco_peluche && npm start`

### Error: connect ECONNREFUSED

**Causa**: MongoDB no está conectado
**Solución**: Verificar MONGODB_URI en .env

### Error 400: El nombre del cliente es requerido

**Causa**: Falta el campo "nombre" en el body
**Solución**: Agregar `"nombre": "..."` al JSON

### Error 404: Cliente no encontrado

**Causa**: ID incorrecto o cliente eliminado
**Solución**: Verificar el ID con GET /api/clientes

---

## 📊 Respuestas de Error Estándar

```json
{
  "ok": false,
  "msg": "Mensaje de error descriptivo"
}
```

**Códigos HTTP**:

- `200`: OK
- `201`: Created
- `400`: Bad Request (datos inválidos)
- `404`: Not Found (recurso no existe)
- `500`: Internal Server Error

---

**Fecha**: 20 de Noviembre, 2025
**Versión API**: 1.0.0
**Base URL**: http://localhost:3000
