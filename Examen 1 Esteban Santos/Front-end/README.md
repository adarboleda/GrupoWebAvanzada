# 🎨 Frontend - Sistema de Reajuste de Sueldos

Frontend desarrollado en React para el Ejercicio 2: Reajuste de Sueldos según Antigüedad.

**Autor:** Esteban Santos  
**Fecha:** Noviembre 2025

---

## 🚀 Instalación

1. **Navegar a la carpeta Front-end:**
```bash
cd "Front-end"
```

2. **Instalar dependencias:**
```bash
npm install
```

---

## ▶️ Ejecutar la aplicación

```bash
npm start
```

La aplicación se abrirá en: `http://localhost:3000`

**IMPORTANTE:** Asegúrate de que el backend esté corriendo en `http://localhost:3001`

---

## 📋 Características de la Vista

### ✅ Campos de Entrada:
- **Nombre del Empleado** - Campo de texto
- **Antigüedad** - Campo numérico (0-50 años)
- **Sueldo Actual** - Campo numérico (monto en pesos)

### ✅ Botones:
- **Calcular Reajuste** - Envía los datos a la API REST
- **Limpiar** - Limpia el formulario

### ✅ Resultados Mostrados:
- ✅ Nombre del empleado
- ✅ Antigüedad ingresada
- ✅ Sueldo actual
- ✅ **Porcentaje de reajuste aplicado**
- ✅ Monto del reajuste
- ✅ **Nuevo sueldo final**
- ✅ Mensaje explicativo

### ✅ Elementos Adicionales:
- Tabla de referencia con todas las reglas de reajuste
- Validaciones en tiempo real
- Mensajes de error claros
- Diseño responsive
- Animaciones suaves

---

## 🎯 Arquitectura MVC

### 📺 VISTA (Form.js)
**Responsabilidades:**
- ✅ Campos para ingresar antigüedad y sueldo actual
- ✅ Botón para calcular reajuste
- ✅ Mostrar resultado: porcentaje aplicado y nuevo sueldo final

### 🎮 CONTROLADOR (Backend API)
**Endpoint:** `POST http://localhost:3001/api/empleados/calcular`

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

### 📦 MODELO (Backend)
- Define la estructura de datos
- No contiene lógica de cálculo

---

## 🛠️ Tecnologías Utilizadas

- **React 18.2.0** - Librería de UI
- **Axios** - Cliente HTTP para llamadas a la API
- **CSS3** - Estilos personalizados
- **JavaScript ES6+** - Lógica de la aplicación

---

## 📱 Capturas de Pantalla

### Formulario
![Formulario](docs/formulario.png)

### Resultado
![Resultado](docs/resultado.png)

---

## 🔗 Conexión con el Backend

Asegúrate de que el backend esté corriendo:

```bash
cd ..
npm start
```

El backend debe estar en: `http://localhost:3001`

---

## 🎓 Cumplimiento de Requisitos

| Requisito | Estado |
|-----------|--------|
| Campos para ingresar antigüedad y sueldo | ✅ |
| Botón para calcular reajuste | ✅ |
| Resultado: porcentaje aplicado | ✅ |
| Resultado: nuevo sueldo final | ✅ |
| Validación de datos | ✅ |
| Conexión con API REST | ✅ |
| Diseño atractivo | ✅ |
| Responsive | ✅ |

---

## 📝 Scripts Disponibles

- `npm start` - Inicia la aplicación en modo desarrollo
- `npm run build` - Crea una versión optimizada para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de React

---

**Desarrollado por Esteban Santos - 2025**
