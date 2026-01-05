# 🚀 Guía de Inicio Rápido

## 1️⃣ Instalar Dependencias
```bash
npm install
```

## 2️⃣ Iniciar el Servidor
```bash
npm start
```

O con auto-reinicio en desarrollo:
```bash
npm run dev
```

## 3️⃣ Verificar que el servidor está funcionando
Abre tu navegador en: http://localhost:3000

## 4️⃣ Probar con Postman
1. Abre Postman
2. Importa la colección: `Postman_Collection.json`
3. Prueba cada endpoint de la colección

## 5️⃣ Probar con curl (alternativa)

### Listar pedidos (200 OK):
```bash
curl http://localhost:3000/api/pedidos
```

### Crear pedido (201 Created):
```bash
curl -X POST http://localhost:3000/api/pedidos -H "Content-Type: application/json" -d "{\"cliente\":\"Test\",\"producto\":\"Monitor\",\"cantidad\":1}"
```

### Error 401 (No autorizado):
```bash
curl http://localhost:3000/api/pedidos/admin
```

### Error 403 (Prohibido):
```bash
curl -X DELETE http://localhost:3000/api/pedidos/admin/1 -H "user-role: usuario"
```

### Error 500 (Error del servidor):
```bash
curl http://localhost:3000/api/pedidos/error
```

## 📋 Endpoints Principales

| Método | Endpoint | Código HTTP |
|--------|----------|-------------|
| GET | `/api/pedidos` | 200 |
| POST | `/api/pedidos` | 201 |
| DELETE | `/api/pedidos/:id` | 204 |
| GET | `/api/pedidos/admin` | 401 |
| DELETE | `/api/pedidos/admin/:id` | 403 |
| GET | `/api/pedidos/error` | 500 |
| GET | `/api/pedidos/servicio` | 503 |

¡Consulta el README.md para la documentación completa! 📚
