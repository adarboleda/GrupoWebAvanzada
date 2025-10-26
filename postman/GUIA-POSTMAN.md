# 📮 Guía de Pruebas con Postman

## 📋 Contenido
- [Instalación](#instalación)
- [Importar Colección](#importar-colección)
- [Configurar Entorno](#configurar-entorno)
- [Pruebas Disponibles](#pruebas-disponibles)
- [Flujo de Prueba Recomendado](#flujo-de-prueba-recomendado)
- [Tests Automatizados](#tests-automatizados)
- [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Instalación

### Opción 1: Postman Desktop (Recomendado)
1. Descarga Postman desde: https://www.postman.com/downloads/
2. Instala la aplicación en tu sistema
3. Crea una cuenta gratuita o inicia sesión

### Opción 2: Postman Web
1. Visita: https://web.postman.co/
2. Inicia sesión con tu cuenta
3. **Nota:** Algunas funciones pueden estar limitadas

---

## 📥 Importar Colección

### Paso 1: Abrir Postman
1. Inicia Postman Desktop o Web
2. Ve a la pestaña **Collections** en el panel izquierdo

### Paso 2: Importar Archivo
1. Haz clic en el botón **Import** (esquina superior izquierda)
2. Arrastra el archivo o haz clic en **Upload Files**
3. Selecciona: `postman/Tiki_Taka_API.postman_collection.json`
4. Haz clic en **Import**

### Paso 3: Verificar Importación
✅ Deberías ver la colección **"Tiki Taka - Sistema de Ventas API"** con 6 peticiones

---

## ⚙️ Configurar Entorno

### Paso 1: Importar Variables de Entorno
1. Haz clic en **Import** nuevamente
2. Selecciona: `postman/Tiki_Taka_Environment.postman_environment.json`
3. Haz clic en **Import**

### Paso 2: Activar Entorno
1. En la esquina superior derecha, busca el selector de entorno
2. Selecciona **"Tiki Taka - Desarrollo"**
3. Verifica que esté activo (aparecerá en naranja/verde)

### Variables Disponibles:
```
base_url        → http://localhost:3000/api
backend_url     → http://localhost:3000
frontend_url    → http://localhost:3001
db_host         → localhost
db_port         → 3306
db_name         → tiki_taka_db
```

---

## 🧪 Pruebas Disponibles

### 1️⃣ Verificar Conexión
**GET** `/test`

**Propósito:** Verificar que el servidor backend esté funcionando y conectado a MySQL

**Respuesta esperada (200 OK):**
```json
{
    "mensaje": "API funcionando correctamente",
    "baseDatos": "Conexión exitosa"
}
```

**Cuándo usar:**
- ✅ Antes de empezar cualquier prueba
- ✅ Después de reiniciar el servidor
- ✅ Para diagnosticar problemas de conexión

---

### 2️⃣ Obtener Todas las Ventas
**GET** `/ventas`

**Propósito:** Listar todas las ventas registradas en el sistema

**Respuesta esperada (200 OK):**
```json
[
    {
        "id": 1,
        "fecha": "2025-10-20T05:00:00.000Z",
        "monto_vendido": 1500.00,
        "tipo_venta": "A"
    },
    {
        "id": 2,
        "fecha": "2025-10-21T05:00:00.000Z",
        "monto_vendido": 750.50,
        "tipo_venta": "B"
    }
]
```

**Cuándo usar:**
- ✅ Para verificar datos existentes
- ✅ Después de crear nuevas ventas
- ✅ Para validar eliminaciones

---

### 3️⃣ Crear Venta Tipo A (> $1000)
**POST** `/ventas`

**Body (JSON):**
```json
{
    "fecha": "2025-10-25",
    "monto_vendido": 1500.00
}
```

**Respuesta esperada (201 Created):**
```json
{
    "id": 10,
    "fecha": "2025-10-25",
    "monto_vendido": 1500.00,
    "tipo_venta": "A"
}
```

**Clasificación automática:**
- 💰 Monto > $1000 → **TIPO A**

**Tests automatizados:**
- ✅ Status code es 201
- ✅ tipo_venta es 'A'
- ✅ monto_vendido es mayor a 1000

---

### 4️⃣ Crear Venta Tipo B ($500 - $1000)
**POST** `/ventas`

**Body (JSON):**
```json
{
    "fecha": "2025-10-25",
    "monto_vendido": 750.50
}
```

**Respuesta esperada (201 Created):**
```json
{
    "id": 11,
    "fecha": "2025-10-25",
    "monto_vendido": 750.50,
    "tipo_venta": "B"
}
```

**Clasificación automática:**
- 💵 $500 ≤ Monto ≤ $1000 → **TIPO B**

**Tests automatizados:**
- ✅ Status code es 201
- ✅ tipo_venta es 'B'
- ✅ monto_vendido está entre 500 y 1000

---

### 5️⃣ Crear Venta Tipo C (< $500)
**POST** `/ventas`

**Body (JSON):**
```json
{
    "fecha": "2025-10-25",
    "monto_vendido": 250.00
}
```

**Respuesta esperada (201 Created):**
```json
{
    "id": 12,
    "fecha": "2025-10-25",
    "monto_vendido": 250.00,
    "tipo_venta": "C"
}
```

**Clasificación automática:**
- 💸 Monto < $500 → **TIPO C**

**Tests automatizados:**
- ✅ Status code es 201
- ✅ tipo_venta es 'C'
- ✅ monto_vendido es menor a 500

---

### 6️⃣ Obtener Estadísticas
**GET** `/ventas/estadisticas`

**Propósito:** Obtener resumen estadístico de todas las ventas

**Respuesta esperada (200 OK):**
```json
{
    "total": 15,
    "montoTotal": 12500.75,
    "tipoA": {
        "cantidad": 5,
        "monto": 7500.00
    },
    "tipoB": {
        "cantidad": 6,
        "monto": 4000.50
    },
    "tipoC": {
        "cantidad": 4,
        "monto": 1000.25
    }
}
```

**Cuándo usar:**
- ✅ Después de crear múltiples ventas
- ✅ Para validar cálculos del modelo
- ✅ Para verificar la capa de lógica de negocio

---

### 7️⃣ Eliminar Todas las Ventas
**DELETE** `/ventas`

**⚠️ PRECAUCIÓN:** Esta acción elimina TODAS las ventas de la base de datos.

**Respuesta esperada (200 OK):**
```json
{
    "mensaje": "Todas las ventas han sido eliminadas"
}
```

**Cuándo usar:**
- ✅ Para limpiar datos de prueba
- ✅ Para resetear el sistema
- ✅ Antes de iniciar una nueva ronda de pruebas

**Tests automatizados:**
- ✅ Status code es 200
- ✅ Mensaje de confirmación presente

---

## 🔄 Flujo de Prueba Recomendado

### Escenario 1: Verificación Inicial del Sistema
```
1. Verificar Conexión              → Confirmar servidor activo
2. Obtener Todas las Ventas        → Ver datos iniciales
3. Obtener Estadísticas            → Verificar cálculos
```

### Escenario 2: Prueba Completa de CRUD
```
1. Verificar Conexión              → Servidor OK
2. Eliminar Todas las Ventas       → Limpiar base de datos
3. Obtener Todas las Ventas        → Confirmar lista vacía []
4. Crear Venta Tipo A              → Monto: 1500
5. Crear Venta Tipo B              → Monto: 750
6. Crear Venta Tipo C              → Monto: 250
7. Obtener Todas las Ventas        → Ver 3 registros nuevos
8. Obtener Estadísticas            → Validar clasificación
```

### Escenario 3: Validación de Clasificación Automática
```
1. Eliminar Todas las Ventas
2. Crear venta con $1001           → Debe ser Tipo A
3. Crear venta con $1000           → Debe ser Tipo B
4. Crear venta con $500            → Debe ser Tipo B
5. Crear venta con $499            → Debe ser Tipo C
6. Obtener Estadísticas            → Verificar distribución
```

### Escenario 4: Prueba de Volumen
```
1. Eliminar Todas las Ventas
2. Crear 5 ventas Tipo A           → Montos > $1000
3. Crear 5 ventas Tipo B           → Montos entre $500-$1000
4. Crear 5 ventas Tipo C           → Montos < $500
5. Obtener Estadísticas            → Total: 15 ventas
6. Obtener Todas las Ventas        → Verificar lista completa
```

---

## ✅ Tests Automatizados

### Ejecutar Tests Individuales
1. Selecciona una petición
2. Haz clic en **Send**
3. Ve a la pestaña **Test Results**
4. Verifica que todos los tests pasen (✅ verde)

### Ejecutar Toda la Colección
1. Haz clic derecho en la colección
2. Selecciona **Run collection**
3. Haz clic en **Run Tiki Taka - Sistema de Ventas API**
4. Observa los resultados:
   - ✅ Tests pasados
   - ❌ Tests fallidos
   - ⏱️ Tiempo de ejecución

### Tests Incluidos

**Para Crear Venta Tipo A:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Venta creada correctamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tipo_venta).to.eql('A');
    pm.expect(jsonData.monto_vendido).to.be.above(1000);
});
```

**Para Crear Venta Tipo B:**
```javascript
pm.test("Venta clasificada como Tipo B", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tipo_venta).to.eql('B');
    pm.expect(jsonData.monto_vendido).to.be.within(500, 1000);
});
```

**Para Crear Venta Tipo C:**
```javascript
pm.test("Venta clasificada como Tipo C", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tipo_venta).to.eql('C');
    pm.expect(jsonData.monto_vendido).to.be.below(500);
});
```

---

## 🔧 Solución de Problemas

### ❌ Error: "Could not get any response"
**Problema:** El servidor backend no está ejecutándose

**Solución:**
```powershell
# En la raíz del proyecto
.\iniciar.ps1
```
O manualmente:
```powershell
cd backend
npm start
```

---

### ❌ Error: "Error: connect ECONNREFUSED"
**Problema:** Puerto 3000 no disponible o servidor caído

**Solución:**
1. Verifica que XAMPP esté ejecutándose
2. Confirma que MySQL esté activo en XAMPP
3. Reinicia el servidor backend
4. Verifica el puerto en `backend/.env`

---

### ❌ Error: "ER_BAD_DB_ERROR: Unknown database"
**Problema:** Base de datos no creada

**Solución:**
1. Abre XAMPP Control Panel
2. Inicia Apache y MySQL
3. Haz clic en **Admin** (MySQL)
4. En phpMyAdmin, ejecuta: `database/schema.sql`

---

### ❌ Tests Fallan (❌ rojo)
**Problema:** La respuesta no cumple las expectativas

**Solución:**
1. Revisa la pestaña **Response**
2. Verifica el **Status Code**
3. Compara el **Body** con el esperado
4. Revisa los logs del servidor backend
5. Verifica la lógica en `backend/models/VentasModel.js`

---

### ❌ Error: "Cannot read property 'tipo_venta' of undefined"
**Problema:** La respuesta no tiene el formato esperado

**Solución:**
1. Verifica que el endpoint esté correcto
2. Revisa el **Body** de la petición (si es POST)
3. Confirma que el controlador esté retornando datos
4. Revisa `backend/controllers/VentasController.js`

---

## 📊 Validación del Flujo MVC

### Verificar Modelo (Model)
**Endpoint:** POST `/ventas`
**Validar:** Clasificación automática en `VentasModel.js`

```javascript
// Lógica en backend/models/VentasModel.js
clasificarVenta(monto) {
    if (monto > 1000) return 'A';
    if (monto >= 500 && monto <= 1000) return 'B';
    return 'C';
}
```

### Verificar Controlador (Controller)
**Endpoint:** GET `/ventas`
**Validar:** Manejo de peticiones en `VentasController.js`

```javascript
// Lógica en backend/controllers/VentasController.js
async obtenerVentas(req, res) {
    try {
        const ventas = await VentasModel.obtenerTodas();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

### Verificar Vista (View)
**URL:** http://localhost:3001
**Validar:** Interfaz React muestra datos de la API

---

## 📝 Notas Importantes

### Formato de Fechas
- **Enviar:** `"2025-10-25"` (formato ISO: YYYY-MM-DD)
- **Recibir:** `"2025-10-25T05:00:00.000Z"` (formato ISO completo)

### Tipos de Datos
- `monto_vendido`: Número decimal (float)
- `fecha`: String en formato ISO
- `tipo_venta`: String ('A', 'B', o 'C')
- `id`: Número entero (auto-incrementado)

### Headers Requeridos
Para peticiones POST:
```
Content-Type: application/json
```

### Códigos de Estado HTTP
- `200 OK` - Operación exitosa (GET, DELETE)
- `201 Created` - Recurso creado exitosamente (POST)
- `400 Bad Request` - Datos inválidos
- `500 Internal Server Error` - Error del servidor

---

## 🎯 Checklist de Pruebas

### Antes de Empezar
- [ ] XAMPP está ejecutándose
- [ ] MySQL está activo en XAMPP
- [ ] Base de datos `tiki_taka_db` existe
- [ ] Servidor backend ejecutándose (puerto 3000)
- [ ] Colección importada en Postman
- [ ] Entorno "Tiki Taka - Desarrollo" activo

### Pruebas Básicas
- [ ] Verificar conexión exitosa
- [ ] Obtener lista de ventas
- [ ] Crear venta Tipo A
- [ ] Crear venta Tipo B
- [ ] Crear venta Tipo C
- [ ] Obtener estadísticas
- [ ] Eliminar todas las ventas

### Pruebas Avanzadas
- [ ] Validar clasificación automática
- [ ] Verificar cálculos de estadísticas
- [ ] Probar con montos límite (500, 1000)
- [ ] Ejecutar toda la colección
- [ ] Todos los tests automáticos pasan

### Validación MVC
- [ ] Modelo clasifica ventas correctamente
- [ ] Controlador maneja errores apropiadamente
- [ ] Vista (React) muestra datos actualizados
- [ ] Flujo de datos funciona en ambas direcciones

---

## 📞 Soporte

### Documentación Adicional
- [README.md](../README.md) - Información general del proyecto
- [INICIO-RAPIDO.md](../INICIO-RAPIDO.md) - Guía de inicio rápido
- [PRUEBAS.md](../PRUEBAS.md) - Guía completa de pruebas

### Logs del Servidor
Para ver logs en tiempo real:
```powershell
cd backend
npm start
```

### Base de Datos
Para verificar datos directamente:
1. Abre phpMyAdmin (http://localhost/phpmyadmin)
2. Selecciona base de datos `tiki_taka_db`
3. Ve a la tabla `ventas`
4. Ejecuta: `SELECT * FROM ventas;`

---

**¡Listo para probar! 🚀**

Empieza con **"Verificar Conexión"** y sigue el flujo recomendado.
