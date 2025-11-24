# Banco Bandido de Peluche - Sistema de Gestión de Clientes

## 📋 Descripción
Sistema de gestión de clientes para el Banco Bandido de Peluche. Permite crear clientes, registrar operaciones financieras, identificar morosos y exportar reportes a Excel/PDF.

## 🏗️ Estructura del Proyecto

```
bancho_peluche/                    # Backend API con Node.js/Express
├── app.js                         # Servidor principal
├── package.json                   # Dependencias
├── .env                          # Configuración (Puerto y MongoDB URI)
├── src/
│   ├── config/
│   │   └── mongo.js              # Conexión a MongoDB
│   ├── controller/
│   │   └── clienteController.js  # Lógica de negocio
│   └── model/
│       └── Cliente.js            # Schema de MongoDB
└── routes/
    └── cliente.routes.js         # Rutas API REST

bancho_peluche_front/             # Frontend con HTML5/JavaScript/Axios
├── index.html                    # Interfaz principal
├── app.js                        # Lógica del cliente
└── style.css                     # Estilos CSS
```

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js (v14+)
- MongoDB local (ejecutándose en puerto 27017) o MongoDB Atlas
- npm o yarn

### 2. Instalación Backend

```bash
# Navegar a la carpeta del backend
cd bancho_peluche

# Instalar dependencias
npm install

# Configurar variables de entorno (.env ya existe)
# Editar si es necesario:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/BancoBandidoPeluche

# Ejecutar servidor
npm run dev    # Modo desarrollo (con nodemon)
# o
npm start      # Modo producción
```

### 3. Instalación Frontend

```bash
# Navegar a la carpeta del frontend
cd bancho_peluche_front

# Abrir archivo en servidor (si no funciona con file://)
# Opción 1: Con Python
python -m http.server 8080

# Opción 2: Con Node.js (instalar http-server global)
npm install -g http-server
http-server -p 8080

# Luego abrir en navegador
# http://localhost:8080/index.html
```

## 📚 Descripción de Características

### Backend API - Endpoints

#### 1. **Crear Cliente**
```
POST /api/clientes
{
  "nombre": "Juan Pérez",
  "saldoAnterior": 100,
  "montoCompras": 250,
  "pagoRealizado": 50
}
```
**Cálculos automáticos:**
- Saldo Base = Saldo Anterior + Compras - Pago
- Pago Mínimo Base = 15% del Saldo Base
- Es Moroso = Pago < Pago Mínimo Base
- Interés = 12% del Saldo Base (si es moroso)
- Multa = $200 (si es moroso)

#### 2. **Listar Todos los Clientes**
```
GET /api/clientes
```

#### 3. **Obtener Cliente por ID**
```
GET /api/clientes/:id
```

#### 4. **Obtener Estadísticas**
```
GET /api/clientes/estadisticas
Retorna: totalClientes, morosos, noMorosos, porcentajes
```

#### 5. **Listar Clientes Morosos**
```
GET /api/clientes/morosos
```

#### 6. **Listar Clientes No Morosos**
```
GET /api/clientes/no-morosos
```

#### 7. **Actualizar Cliente**
```
PUT /api/clientes/:id
```

#### 8. **Eliminar Cliente**
```
DELETE /api/clientes/:id
```

### Frontend - Funcionalidades

#### 1. **Dashboard de Estadísticas**
- Total de clientes
- Cantidad y porcentaje de morosos
- Cantidad y porcentaje de no morosos

#### 2. **Crear Cliente**
- Formulario con validación
- Campo de nombre (requerido)
- Campos de cálculo: saldo anterior, compras, pago realizado

#### 3. **Filtrar Clientes**
- Todos los clientes
- Solo morosos
- Solo no morosos

#### 4. **Ver Detalle del Cliente**
- Modal con información completa
- Muestra todos los cálculos (intereses, multas, etc.)
- Fecha de creación

#### 5. **Exportar Datos**
- **Excel (.xlsx):** Archivo completo con toda la información
- **PDF:** Reporte formateado con tabla y estadísticas

#### 6. **Eliminar Cliente**
- Confirmación antes de eliminar
- Actualización automática de estadísticas

## 📋 Validaciones Implementadas

### Backend
- Validación de campos requeridos
- Conversión a números (parseFloat)
- Cálculo automático de intereses y multas
- Verificación de existencia de cliente antes de actualizar/eliminar

### Frontend
- Validación de campos vacíos
- Confirmación antes de eliminar
- Manejo de errores con alertas

## 🛠️ Tecnologías Utilizadas

### Backend
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Comunicación entre frontend y backend
- **Dotenv** - Variables de entorno
- **Nodemon** - Desarrollo con hot-reload

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos con gradientes y animaciones
- **JavaScript Vanilla** - Lógica del cliente
- **Axios** - Cliente HTTP
- **XLSX** - Exportar a Excel
- **jsPDF** - Exportar a PDF
- **jsPDF-AutoTable** - Tablas en PDF

## 🔄 Flujo de Funcionamiento

1. **Usuario accede a la página** → Se cargan automáticamente todos los clientes y estadísticas
2. **Usuario crea un cliente** → Backend calcula automáticamente valores financieros
3. **Datos se guardan en MongoDB** → Cliente ve la lista actualizada
4. **Usuario puede filtrar** → Mostrar morosos o no morosos
5. **Ver detalle** → Modal con información completa
6. **Exportar** → Excel o PDF con los datos

## 🐛 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
# Linux/Mac:
ps aux | grep mongod

# Windows:
# Abrir Services y buscar MongoDB

# O usar MongoDB Atlas (cloud):
# Cambiar MONGO_URI en .env a tu URL de Atlas
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/BancoBandidoPeluche
```

### Frontend no carga datos
- Verificar que el backend está ejecutándose en puerto 3000
- Verificar CORS está habilitado
- Abrir consola del navegador (F12) para ver errores

### Error de permisos en PowerShell
```powershell
# Ejecutar como administrador o cambiar política de ejecución
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📊 Ejemplo de Cálculo

**Entrada:**
- Nombre: Carlos
- Saldo Anterior: $500
- Compras: $200
- Pago Realizado: $50

**Cálculos internos:**
- Saldo Base = 500 + 200 - 50 = **$650**
- Pago Mínimo Base = 650 × 0.15 = **$97.50**
- Es Moroso = 50 < 97.50 = **SÍ**
- Interés = 650 × 0.12 = **$78**
- Multa = **$200**
- Saldo Actual = 650 + 78 + 200 = **$928**
- Pago Mínimo = 928 × 0.15 = **$139.20**
- Pago Sin Intereses = 928 × 0.85 = **$788.80**

## 📝 Notas Importantes

✅ **Respeta la sintaxis y estructura de ejemploMongo**
✅ **Validaciones lógicas implementadas**
✅ **Nombre del cliente agregado a todos los campos**
✅ **Filtrado por estado de morosidad**
✅ **Exportación a Excel y PDF**
✅ **Modal para ver detalles**
✅ **Estadísticas en tiempo real**

## 🎯 Próximas Mejoras (Opcionales)

- [ ] Autenticación de usuarios
- [ ] Edición de clientes (actualizar datos)
- [ ] Búsqueda por nombre
- [ ] Pagación en la tabla
- [ ] Gráficos de estadísticas
- [ ] Validación de email
- [ ] Historial de cambios
- [ ] Envío de correos a morosos

---

**Desarrollado siguiendo las guías de estructura y sintaxis del curso**
