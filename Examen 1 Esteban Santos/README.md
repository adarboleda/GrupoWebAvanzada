# 🎓 Examen 1 - Programación Web Avanzada
## API REST con Node.js, Express y MySQL

**Autor:** Esteban Santos  
**Fecha:** Noviembre 2025

---

## 📋 DESCRIPCIÓN DEL PROYECTO

Este proyecto implementa una API REST con arquitectura MVC (Modelo-Vista-Controlador) utilizando Node.js, Express y MySQL con Sequelize ORM.

**Ejercicio 2:** Reajuste de Sueldos según Antigüedad

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

- **Node.js** v18+ - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MySQL** - Sistema de gestión de base de datos
- **Sequelize** - ORM para Node.js
- **dotenv** - Gestión de variables de entorno
- **cors** - Manejo de Cross-Origin Resource Sharing
- **nodemon** - Reinicio automático del servidor en desarrollo

---

## 📁 ESTRUCTURA DEL PROYECTO

```
📦 Examen 1 Esteban Santos
├── 📂 Back-end
│   ├── 📂 config
│   │   └── database.js          # Configuración de Sequelize
│   ├── 📂 controllers
│   │   └── empleado.controller.js # Lógica del Ejercicio 2
│   ├── 📂 models
│   │   └── empleado.model.js    # Modelo de Empleados
│   └── 📂 Routes
├── 📂 routes
│   └── empleado.routes.js       # Rutas del Ejercicio 2
├── 📂 Front-end                 # (Vacío - para futuras vistas)
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── database.sql                 # Scripts SQL
├── server.js                    # Servidor principal
├── package.json                 # Dependencias del proyecto
└── PRUEBAS_POSTMAN_EJERCICIO2.md # Guía de pruebas
```

---

## 🚀 INSTALACIÓN Y CONFIGURACIÓN

### 1. **Clonar o descargar el proyecto**
```bash
cd "c:\Users\User\Desktop\Programacion Web Avanzada\Examen 1 Esteban Santos"
```

### 2. **Instalar dependencias**
```bash
npm install
```

### 3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3001
NODE_ENV=development

# Configuración de Base de Datos MySQL (XAMPP)
DB_NAME=cuotas_seguros
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### 4. **Iniciar MySQL (XAMPP)**
- Abrir XAMPP Control Panel
- Iniciar Apache y MySQL

### 5. **Crear la base de datos**

Opción A - Automática (Sequelize):
```bash
npm start
```
Sequelize creará automáticamente las tablas.

Opción B - Manual:
1. Abrir phpMyAdmin: `http://localhost/phpmyadmin`
2. Ejecutar el archivo `database.sql`

### 6. **Iniciar el servidor**
```bash
npm start
```

El servidor estará corriendo en: `http://localhost:3001`

---

## 📡 ENDPOINTS DE LA API

### 🏠 **Ruta Principal**
- **GET** `/` - Información general de la API

### ‍💼 **Ejercicio 2: Reajuste de Sueldos**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empleados` | Listar todos los empleados |
| POST | `/api/empleados` | Crear nuevo empleado |
| GET | `/api/empleados/:id` | Obtener empleado por ID |
| PUT | `/api/empleados/:id` | Actualizar empleado |
| DELETE | `/api/empleados/:id` | Eliminar empleado |
| GET | `/api/empleados/:id/calcular` | Calcular reajuste (guardado) |
| POST | `/api/empleados/calcular` | Calcular reajuste (directo) |

**Reglas de negocio:**

| Antigüedad | Sueldo | Reajuste |
|------------|--------|----------|
| Hasta 10 años | <= $300,000 | 12% |
| Hasta 10 años | $300,001 - $500,000 | 10% |
| Hasta 10 años | > $500,000 | 8% |
| 10-20 años | <= $300,000 | 14% |
| 10-20 años | $300,001 - $500,000 | 12% |
| 10-20 años | > $500,000 | 10% |
| >= 20 años | Cualquier sueldo | 15% |

---

## 🧪 PRUEBAS CON POSTMAN

### **Ejemplo 1: Calcular reajuste directo**

**Request:**
```http
POST http://localhost:3001/api/empleados/calcular
Content-Type: application/json

{
  "nombreEmpleado": "Juan Pérez",
  "antiguedad": 5,
  "sueldoActual": 250000
}
```

**Response:**
```json
{
  "success": true,
  "empleado": {
    "nombreEmpleado": "Juan Pérez"
  },
  "calculo": {
    "antiguedad": 5,
    "sueldoActual": 250000,
    "porcentajeReajuste": 12,
    "montoReajuste": 30000,
    "nuevoSueldo": 280000,
    "mensaje": "Empleado con 5 año(s) de antigüedad y sueldo de $250,000 recibe 12% de reajuste"
  }
}
```

### **Ejemplo 2: Crear y calcular empleado**

1. **Crear empleado:**
```http
POST http://localhost:3001/api/empleados
Content-Type: application/json

{
  "nombreEmpleado": "María González",
  "antiguedad": 22,
  "sueldoActual": 600000
}
```

2. **Calcular reajuste (usar ID del empleado creado):**
```http
GET http://localhost:3001/api/empleados/1/calcular
```

📖 **Para más ejemplos, consulta:** `PRUEBAS_POSTMAN_EJERCICIO2.md`

---

## 🏗️ ARQUITECTURA MVC

### **MODELO** (Model)
- Define la estructura de datos
- Implementa la lógica de negocio
- Validaciones a nivel de BD
- Métodos de cálculo

**Archivos:**
- `Back-end/models/empleado.model.js`

### **CONTROLADOR** (Controller)
- Recibe peticiones HTTP
- Valida datos de entrada
- Invoca métodos del modelo
- Retorna respuestas JSON

**Archivos:**
- `Back-end/controllers/empleado.controller.js`

### **VISTA** (View)
- Interfaz de usuario (Postman/Cliente HTTP)
- Envía datos al controlador
- Muestra resultados

### **RUTAS** (Routes)
- Define endpoints
- Conecta URLs con controladores

**Archivos:**
- `routes/empleado.routes.js`

---

## ✅ VALIDACIONES IMPLEMENTADAS

### **Ejercicio 2: Reajuste de Sueldos**
- ✅ Antigüedad >= 0
- ✅ Sueldo > 0
- ✅ Todos los campos obligatorios
- ✅ Tipos de datos correctos
- ✅ Registros no encontrados (404)
- ✅ Cálculo según tabla de reajustes
- ✅ Redondeo a 2 decimales

---

## 📊 BASE DE DATOS

### **Tabla: empleados**
```sql
CREATE TABLE empleados (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombreEmpleado VARCHAR(100) NOT NULL,
  antiguedad INT NOT NULL,
  sueldoActual DECIMAL(10,2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Error: Cannot connect to database**
- Verificar que MySQL esté corriendo en XAMPP
- Revisar credenciales en archivo `.env`
- Confirmar que la BD existe

### **Error: Port 3001 is already in use**
- Cambiar el puerto en `.env`
- O detener el proceso que usa el puerto 3001

### **Error: Module not found**
```bash
npm install
```

### **Error: Table doesn't exist**
- Ejecutar `database.sql` en phpMyAdmin
- O reiniciar el servidor para que Sequelize cree las tablas

---

## 📝 SCRIPTS DISPONIBLES

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor con nodemon (desarrollo)

---

## 🎯 CASOS DE PRUEBA EXITOSOS

### **Ejercicio 2:**
✅ Empleado 5 años, $250,000 → 12% = $280,000  
✅ Empleado 8 años, $350,000 → 10% = $385,000  
✅ Empleado 12 años, $280,000 → 14% = $319,200  
✅ Empleado 15 años, $450,000 → 12% = $504,000  
✅ Empleado 22 años, $600,000 → 15% = $690,000  
✅ Empleado 3 años, $520,000 → 8% = $561,600  
✅ Validación antigüedad negativa  
✅ Validación sueldo <= 0  
✅ Validación datos faltantes  

---

## 📚 RECURSOS ADICIONALES

- [Documentación Express.js](https://expressjs.com/)
- [Documentación Sequelize](https://sequelize.org/)
- [Guía de Postman](https://learning.postman.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 👤 AUTOR

**Esteban Santos**  
Programación Web Avanzada  
Noviembre 2025

---

## 📄 LICENCIA

ISC

---

**¡Proyecto completado y listo para usar! 🚀**
