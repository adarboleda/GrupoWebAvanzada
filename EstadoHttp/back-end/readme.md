# 🏪 API de Gestión de Pedidos - Soft&Hard

## 📋 Descripción del Proyecto

Esta es una API RESTful desarrollada en Node.js con Express para gestionar pedidos de una tienda en línea. El proyecto está diseñado para demostrar y probar todos los códigos de estado HTTP en diferentes escenarios.

## 🎯 Caso Práctico

La empresa **Soft&Hard** está desarrollando una API para gestionar pedidos de su tienda en línea. El equipo de desarrollo necesita probar cómo se comporta la API en diferentes escenarios y asegurarse de que los códigos de estado HTTP sean correctos.

## 🔧 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)
- Postman o curl para probar los endpoints

## 📦 Instalación

1. Instalar las dependencias:
```bash
npm init -y
npm install express
```

2. Iniciar el servidor:
```bash
node app.js
```

El servidor se ejecutará en `http://localhost:3000`

## 📚 Documentación de Endpoints

### 🟢 Estados 2XX - Respuestas Exitosas

#### **200 OK** - Obtener todos los pedidos
```
GET /api/pedidos
```
**Respuesta:**
```json
{
  "mensaje": "Pedidos obtenidos exitosamente",
  "total": 2,
  "datos": [...]
}
```

#### **200 OK** - Obtener un pedido específico
```
GET /api/pedidos/:id
```
**Ejemplo:** `GET /api/pedidos/1`

#### **201 Created** - Crear un nuevo pedido
```
POST /api/pedidos
Content-Type: application/json

{
  "cliente": "Ana García",
  "producto": "Teclado",
  "cantidad": 1
}
```

#### **204 No Content** - Eliminar un pedido
```
DELETE /api/pedidos/:id
```
**Ejemplo:** `DELETE /api/pedidos/1`

---

### 🔵 Estados 3XX - Redirecciones

#### **301 Moved Permanently** - Redirección permanente
```
GET /pedidos
```
Redirige a `/api/pedidos`

#### **302 Found** - Redirección temporal
```
GET /api/orden/:id
```
Redirige a `/api/pedidos/:id`

#### **304 Not Modified** - Recurso no modificado
```
GET /api/pedidos/cache/:id
Header: If-None-Match: 12345-version1
```

---

### 🟡 Estados 4XX - Errores del Cliente

#### **400 Bad Request** - Solicitud incorrecta
```
POST /api/pedidos/validar
Content-Type: application/json

{
  "cantidad": -5
}
```

#### **401 Unauthorized** - No autorizado
```
GET /api/pedidos/admin
```
**Sin token o con token inválido**

**Para acceso autorizado:**
```
GET /api/pedidos/admin
Header: Authorization: Bearer token-secreto-123
```

#### **403 Forbidden** - Prohibido
```
DELETE /api/pedidos/admin/:id
Header: user-role: usuario
```
**Para acceso permitido:**
```
DELETE /api/pedidos/admin/:id
Header: user-role: admin
```

#### **404 Not Found** - Recurso no encontrado
```
GET /api/productos/999
```

#### **405 Method Not Allowed** - Método no permitido
```
PATCH /api/pedidos
```

#### **409 Conflict** - Conflicto
```
POST /api/pedidos/duplicado
Content-Type: application/json

{
  "id": 1
}
```

---

### 🔴 Estados 5XX - Errores del Servidor

#### **500 Internal Server Error** - Error interno del servidor
```
GET /api/pedidos/error
```

#### **502 Bad Gateway** - Puerta de enlace incorrecta
```
GET /api/pedidos/external
```

#### **503 Service Unavailable** - Servicio no disponible
```
GET /api/pedidos/servicio
```

**Activar modo mantenimiento:**
```
POST /api/mantenimiento
Content-Type: application/json

{
  "activar": true
}
```

#### **504 Gateway Timeout** - Tiempo de espera agotado
```
GET /api/pedidos/timeout
```

---

## 🧪 Pruebas con Postman

### Colección de Pruebas Recomendadas:

1. **Pruebas Exitosas (2XX)**
   - Listar todos los pedidos
   - Crear un nuevo pedido
   - Eliminar un pedido

2. **Pruebas de Redirección (3XX)**
   - Probar redirección permanente
   - Probar redirección temporal

3. **Pruebas de Errores del Cliente (4XX)**
   - Intentar acceder sin autorización
   - Intentar acceder con permisos insuficientes
   - Enviar datos inválidos

4. **Pruebas de Errores del Servidor (5XX)**
   - Simular error interno
   - Probar servicio en mantenimiento

### Ejemplos con curl:

```bash
# 200 OK - Listar pedidos
curl http://localhost:3000/api/pedidos

# 201 Created - Crear pedido
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Pedro","producto":"Monitor","cantidad":1}'

# 401 Unauthorized
curl http://localhost:3000/api/pedidos/admin

# 403 Forbidden
curl -X DELETE http://localhost:3000/api/pedidos/admin/1 \
  -H "user-role: usuario"

# 503 Service Unavailable (activar mantenimiento primero)
curl -X POST http://localhost:3000/api/mantenimiento \
  -H "Content-Type: application/json" \
  -d '{"activar":true}'

curl http://localhost:3000/api/pedidos/servicio
```

## 📊 Resumen de Estados HTTP Implementados

| Código | Descripción | Endpoint |
|--------|-------------|----------|
| 200 | OK | `/api/pedidos` |
| 201 | Created | `POST /api/pedidos` |
| 204 | No Content | `DELETE /api/pedidos/:id` |
| 301 | Moved Permanently | `/pedidos` |
| 302 | Found | `/api/orden/:id` |
| 304 | Not Modified | `/api/pedidos/cache/:id` |
| 400 | Bad Request | `POST /api/pedidos/validar` |
| 401 | Unauthorized | `/api/pedidos/admin` |
| 403 | Forbidden | `DELETE /api/pedidos/admin/:id` |
| 404 | Not Found | `/api/productos/:id` |
| 405 | Method Not Allowed | `PATCH /api/pedidos` |
| 409 | Conflict | `POST /api/pedidos/duplicado` |
| 500 | Internal Server Error | `/api/pedidos/error` |
| 502 | Bad Gateway | `/api/pedidos/external` |
| 503 | Service Unavailable | `/api/pedidos/servicio` |
| 504 | Gateway Timeout | `/api/pedidos/timeout` |

## 🎓 Conceptos Clave

### Middleware
- `express.json()`: Permite al servidor procesar peticiones con formato JSON

### Array de Almacenamiento
- Los pedidos se almacenan en memoria en un array JavaScript
- Los datos se pierden al reiniciar el servidor

### Headers HTTP
- `Authorization`: Para autenticación
- `user-role`: Para verificar permisos
- `If-None-Match`: Para validación de caché

## 🚀 Mejoras Futuras

- [ ] Integrar una base de datos (MongoDB, PostgreSQL)
- [ ] Implementar autenticación JWT real
- [ ] Agregar validación de datos con middleware
- [ ] Implementar paginación en listados
- [ ] Agregar logs de peticiones
- [ ] Documentación con Swagger/OpenAPI

## 👥 Autor

Proyecto desarrollado para Soft&Hard - Ejercicio de Estados HTTP

## 📄 Licencia

Este es un proyecto educativo de código abierto.
