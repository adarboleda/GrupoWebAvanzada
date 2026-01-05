# 🚀 GUÍA COMPLETA DE USO - FULL STACK

## Sistema de Reajuste de Sueldos - Ejercicio 2
**Autor:** Esteban Santos  
**Fecha:** Noviembre 2025

---

## 📋 ARQUITECTURA DEL PROYECTO

```
📦 Examen 1 Esteban Santos
├── 📂 Back-end/          → API REST (Node.js + Express + MySQL)
│   ├── config/           → Configuración de BD
│   ├── controllers/      → Lógica de negocio (CONTROLADOR)
│   ├── models/           → Estructura de datos (MODELO)
│   └── Routes/
├── 📂 Front-end/         → Interfaz React (VISTA)
│   ├── public/
│   └── src/
│       ├── components/   → Form.js (Formulario principal)
│       ├── App.js
│       └── index.js
├── 📂 routes/            → Rutas de la API
├── server.js             → Servidor principal
└── database.sql          → Scripts SQL
```

---

## ⚙️ INSTALACIÓN COMPLETA

### 1️⃣ **Instalar Backend**

```bash
# Navegar a la raíz del proyecto
cd "c:\Users\User\Desktop\Programacion Web Avanzada\Examen 1 Esteban Santos"

# Instalar dependencias del backend
npm install
```

### 2️⃣ **Instalar Frontend**

```bash
# Navegar a la carpeta Front-end
cd Front-end

# Instalar dependencias del frontend
npm install

# Volver a la raíz
cd ..
```

### 3️⃣ **Configurar Base de Datos**

1. Abrir XAMPP y iniciar MySQL
2. Abrir phpMyAdmin: `http://localhost/phpmyadmin`
3. Crear la base de datos ejecutando `database.sql`

---

## 🚀 EJECUTAR LA APLICACIÓN

### **Terminal 1 - Backend (API REST)**

```bash
# Desde la raíz del proyecto
npm start
```

✅ El backend estará en: `http://localhost:3001`

### **Terminal 2 - Frontend (React)**

```bash
# Desde la carpeta Front-end
cd Front-end
npm start
```

✅ El frontend se abrirá automáticamente en: `http://localhost:3000`

---

## 🎯 USO DE LA APLICACIÓN

### **1. Abrir el navegador**
Se abrirá automáticamente en `http://localhost:3000`

### **2. Llenar el formulario:**
- **Nombre del Empleado:** Ej: "Juan Pérez"
- **Antigüedad:** Ej: 5 (años)
- **Sueldo Actual:** Ej: 250000

### **3. Hacer clic en "Calcular Reajuste"**

### **4. Ver el resultado:**
- ✅ Porcentaje de reajuste aplicado (12%)
- ✅ Monto del reajuste ($30,000)
- ✅ Nuevo sueldo final ($280,000)

---

## 📊 EJEMPLOS DE PRUEBA

### Caso 1: Antigüedad baja, sueldo bajo
```
Nombre: María González
Antigüedad: 5 años
Sueldo: $250,000
Resultado: 12% → Nuevo sueldo: $280,000
```

### Caso 2: Antigüedad media, sueldo medio
```
Nombre: Carlos López
Antigüedad: 15 años
Sueldo: $450,000
Resultado: 12% → Nuevo sueldo: $504,000
```

### Caso 3: Antigüedad alta, sueldo alto
```
Nombre: Ana Martínez
Antigüedad: 20 años
Sueldo: $600,000
Resultado: 10% → Nuevo sueldo: $660,000
```

---

## 🏗️ ARQUITECTURA MVC COMPLETA

### 📦 **MODELO** (`Back-end/models/empleado.model.js`)
- Define la estructura de datos
- Atributos: id, nombreEmpleado, antiguedad, sueldoActual
- **NO contiene lógica de cálculo**

### 🎮 **CONTROLADOR** (`Back-end/controllers/empleado.controller.js`)
- Recibe datos desde la VISTA
- Determina el porcentaje de reajuste según la tabla
- Calcula el nuevo sueldo
- Valida datos (antigüedad ≥ 0, sueldo > 0)

### 📺 **VISTA** (`Front-end/src/components/Form.js`)
- Campos para ingresar antigüedad y sueldo actual
- Botón para calcular reajuste
- Muestra: porcentaje aplicado y nuevo sueldo final

---

## 🔄 FLUJO DE DATOS

```
┌─────────────────────────────────────────────────┐
│                    VISTA                        │
│              (Form.js - React)                  │
│                                                 │
│  1. Usuario ingresa:                            │
│     - Nombre: "Juan Pérez"                      │
│     - Antigüedad: 5 años                        │
│     - Sueldo: $250,000                          │
│                                                 │
│  2. Clic en "Calcular Reajuste"                 │
└─────────────┬───────────────────────────────────┘
              │
              │ POST http://localhost:3001/api/empleados/calcular
              │ Body: { nombreEmpleado, antiguedad, sueldoActual }
              │
              ▼
┌─────────────────────────────────────────────────┐
│                 CONTROLADOR                     │
│         (empleado.controller.js)                │
│                                                 │
│  3. Valida datos:                               │
│     ✓ antiguedad >= 0                           │
│     ✓ sueldoActual > 0                          │
│                                                 │
│  4. Determina porcentaje:                       │
│     IF antiguedad <= 10 && sueldo <= 300000     │
│        → 12%                                    │
│                                                 │
│  5. Calcula:                                    │
│     - montoReajuste = 250000 * 0.12 = 30000     │
│     - nuevoSueldo = 250000 + 30000 = 280000     │
└─────────────┬───────────────────────────────────┘
              │
              │ Response JSON
              │
              ▼
┌─────────────────────────────────────────────────┐
│                    VISTA                        │
│              (Form.js - React)                  │
│                                                 │
│  6. Muestra resultado:                          │
│     ✅ Porcentaje: 12%                          │
│     ✅ Reajuste: $30,000                        │
│     ✅ Nuevo sueldo: $280,000                   │
└─────────────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS

### **POST** `/api/empleados/calcular`
Calcula el reajuste sin guardar en BD

**Request:**
```json
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
    "mensaje": "Empleado con 5 año(s) de antigüedad..."
  }
}
```

---

## ❌ SOLUCIÓN DE PROBLEMAS

### **Error: Cannot connect to server**
```bash
# Verificar que el backend esté corriendo
cd "c:\Users\User\Desktop\Programacion Web Avanzada\Examen 1 Esteban Santos"
npm start
```

### **Error: CORS**
Ya está configurado en el backend con:
```javascript
app.use(cors());
```

### **Puerto 3001 ocupado**
Cambiar el puerto en `.env`:
```
PORT=3002
```

### **Frontend no carga**
```bash
cd Front-end
npm install
npm start
```

---

## 📋 CHECKLIST ANTES DE PRESENTAR

- [ ] MySQL corriendo en XAMPP
- [ ] Base de datos creada
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Probar un cálculo de ejemplo
- [ ] Verificar que se muestren todos los resultados

---

## 🎓 CUMPLIMIENTO DE REQUISITOS

| Requisito | Componente | Estado |
|-----------|------------|--------|
| **MODELO:** Solo estructura de datos | `empleado.model.js` | ✅ |
| **CONTROLADOR:** Lógica de cálculo | `empleado.controller.js` | ✅ |
| **VISTA:** Campos de entrada | `Form.js` | ✅ |
| **VISTA:** Botón calcular | `Form.js` | ✅ |
| **VISTA:** Mostrar porcentaje | `Form.js` | ✅ |
| **VISTA:** Mostrar nuevo sueldo | `Form.js` | ✅ |
| Validaciones | Controlador + Vista | ✅ |
| API REST | Backend completo | ✅ |

---

## 🎨 CARACTERÍSTICAS DEL FRONTEND

✅ Diseño moderno y atractivo  
✅ Animaciones suaves  
✅ Validación en tiempo real  
✅ Mensajes de error claros  
✅ Tabla de referencia de reajustes  
✅ Formato de moneda chilena  
✅ Responsive (móvil y desktop)  
✅ Loading states  
✅ Botón limpiar formulario  

---

## 📞 COMANDOS RÁPIDOS

**Iniciar todo:**
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd Front-end && npm start
```

**Detener todo:**
```
Ctrl + C en ambas terminales
```

---

**¡Listo para usar! 🎉**

Desarrollado por **Esteban Santos**  
Programación Web Avanzada - 2025
