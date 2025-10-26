# 📮 Colección Postman - Tiki Taka API

Esta carpeta contiene todo lo necesario para probar la API REST del sistema de ventas Tiki Taka usando Postman.

## 📁 Archivos Incluidos

### 1. `Tiki_Taka_API.postman_collection.json`
**Colección completa de Postman** con 6 endpoints:
- ✅ Verificar Conexión
- 📋 Obtener Todas las Ventas
- ➕ Crear Venta Tipo A (> $1000)
- ➕ Crear Venta Tipo B ($500 - $1000)
- ➕ Crear Venta Tipo C (< $500)
- 📊 Obtener Estadísticas
- 🗑️ Eliminar Todas las Ventas

### 2. `Tiki_Taka_Environment.postman_environment.json`
**Variables de entorno** preconfiguradas:
```
base_url     = http://localhost:3000/api
backend_url  = http://localhost:3000
frontend_url = http://localhost:3001
db_host      = localhost
db_port      = 3306
db_name      = tiki_taka_db
```

### 3. `GUIA-POSTMAN.md`
**Guía completa** con:
- Instrucciones de instalación
- Pasos de importación
- Descripción de cada endpoint
- Flujos de prueba recomendados
- Tests automatizados
- Solución de problemas

---

## 🚀 Inicio Rápido

### Paso 1: Instalar Postman
Descarga desde: https://www.postman.com/downloads/

### Paso 2: Importar Archivos
1. Abre Postman
2. Clic en **Import**
3. Arrastra estos dos archivos:
   - `Tiki_Taka_API.postman_collection.json`
   - `Tiki_Taka_Environment.postman_environment.json`

### Paso 3: Activar Entorno
1. En la esquina superior derecha
2. Selecciona **"Tiki Taka - Desarrollo"**

### Paso 4: Ejecutar Servidor
```powershell
# Desde la raíz del proyecto
.\iniciar.ps1
```

### Paso 5: Probar
1. Selecciona la petición **"Verificar Conexión"**
2. Haz clic en **Send**
3. Deberías ver: `{"mensaje": "API funcionando correctamente", "baseDatos": "Conexión exitosa"}`

---

## 📊 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/test` | Verificar conexión del servidor y BD |
| GET | `/ventas` | Obtener todas las ventas |
| POST | `/ventas` | Crear nueva venta (clasificación automática) |
| GET | `/ventas/estadisticas` | Obtener estadísticas agrupadas |
| DELETE | `/ventas` | Eliminar todas las ventas |

---

## 🧪 Tests Automatizados

Cada petición incluye tests automáticos que validan:
- ✅ Status codes correctos (200, 201)
- ✅ Clasificación automática de ventas (A, B, C)
- ✅ Formato de respuestas
- ✅ Rangos de montos

**Ejecutar todos los tests:**
1. Clic derecho en la colección
2. **Run collection**
3. Ver resultados en el Runner

---

## 📝 Ejemplos de Uso

### Crear Venta Tipo A
```json
POST /api/ventas
{
    "fecha": "2025-10-25",
    "monto_vendido": 1500.00
}
```
**Respuesta:**
```json
{
    "id": 1,
    "fecha": "2025-10-25",
    "monto_vendido": 1500.00,
    "tipo_venta": "A"
}
```

### Obtener Estadísticas
```json
GET /api/ventas/estadisticas
```
**Respuesta:**
```json
{
    "total": 3,
    "montoTotal": 2500.50,
    "tipoA": { "cantidad": 1, "monto": 1500.00 },
    "tipoB": { "cantidad": 1, "monto": 750.50 },
    "tipoC": { "cantidad": 1, "monto": 250.00 }
}
```

---

## 🔄 Flujo de Prueba Recomendado

1. **Verificar Conexión** - Confirmar que el servidor esté activo
2. **Eliminar Todas las Ventas** - Limpiar datos de prueba
3. **Crear Venta Tipo A** - Monto: 1500
4. **Crear Venta Tipo B** - Monto: 750
5. **Crear Venta Tipo C** - Monto: 250
6. **Obtener Todas las Ventas** - Ver las 3 ventas creadas
7. **Obtener Estadísticas** - Validar cálculos

---

## 🎯 Validación MVC

Estas pruebas validan la arquitectura MVC:

### Modelo (VentasModel.js)
- Clasificación automática de ventas
- Cálculos de estadísticas
- Operaciones CRUD en MySQL

### Vista (React Frontend)
- Visualización en http://localhost:3001
- Sincronización con API

### Controlador (VentasController.js)
- Manejo de peticiones HTTP
- Validación de datos
- Respuestas JSON

---

## ⚠️ Requisitos Previos

Antes de usar Postman, asegúrate de que:
- [ ] XAMPP esté ejecutándose
- [ ] MySQL esté activo
- [ ] Base de datos `tiki_taka_db` exista
- [ ] Servidor backend esté en puerto 3000
- [ ] No haya errores en la consola del backend

---

## 📖 Documentación Completa

Para instrucciones detalladas, lee: [GUIA-POSTMAN.md](GUIA-POSTMAN.md)

---

## 🆘 Solución de Problemas

### Error: "Could not get any response"
**Solución:** Ejecuta `.\iniciar.ps1` desde la raíz del proyecto

### Error: "Unknown database 'tiki_taka_db'"
**Solución:** Ejecuta `database/schema.sql` en phpMyAdmin

### Error: "ECONNREFUSED"
**Solución:** Verifica que XAMPP y MySQL estén activos

---

## 📞 Ayuda Adicional

- [README.md](../README.md) - Documentación principal
- [INICIO-RAPIDO.md](../INICIO-RAPIDO.md) - Guía de inicio
- [PRUEBAS.md](../PRUEBAS.md) - Pruebas completas del sistema

---

**¡Listo para probar la API! 🚀**
