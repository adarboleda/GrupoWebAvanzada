# Banco Peluche - Sistema de Gestión de Clientes

Sistema completo de gestión bancaria con backend en Node.js + Express + MongoDB y frontend en React.

## 🚀 Características

- ✅ **CRUD completo de clientes** con cálculos automáticos
- ✅ **Gestión de morosidad** (interés 12% + multa $200)
- ✅ **Estadísticas en tiempo real** de clientes morosos vs al día
- ✅ **Vista de detalle** completa de cada cliente
- ✅ **Exportación a PDF y Excel** de datos y estadísticas
- ✅ **Diseño responsivo** inspirado en Banco Pichincha
- ✅ **Conexión a MongoDB Atlas** en la nube

## 📋 Lógica de Negocio

### Cálculos Automáticos

1. **Saldo Base** = Saldo Anterior + Monto Compras - Pago Realizado
2. **Pago Mínimo Base** = 15% del Saldo Base
3. **Morosidad**: Cliente es moroso si Pago Realizado < Pago Mínimo Base
4. **Si es moroso**:
   - Interés = 12% del Saldo Base
   - Multa = $200 fijos
5. **Saldo Actual** = Saldo Base + Interés + Multa
6. **Pago Mínimo** = 15% del Saldo Actual
7. **Pago Sin Intereses** = 85% del Saldo Actual

## 🛠️ Tecnologías

### Backend

- Node.js
- Express v5.1.0
- MongoDB + Mongoose v8.20.1
- CORS
- dotenv

### Frontend

- React v19.2.0
- React Router DOM
- Axios v1.13.2
- jsPDF + jsPDF-AutoTable (exportación PDF)
- XLSX (exportación Excel)

## 📁 Estructura del Proyecto

```
7.axios/
├── banco_peluche/              # Backend
│   ├── app.js                  # Servidor principal
│   ├── .env                    # Variables de entorno
│   ├── config/
│   │   └── mongo.js            # Configuración MongoDB Atlas
│   ├── models/
│   │   └── Cliente.js          # Modelo Mongoose
│   ├── services/
│   │   └── cliente.service.js  # Lógica de negocio
│   ├── controllers/
│   │   └── cliente.controller.js # Controladores
│   └── routes/
│       └── cliente.routes.js   # Rutas API
│
└── banco_peluche_react/        # Frontend
    ├── src/
    │   ├── App.js              # Componente principal
    │   ├── components/
    │   │   ├── Navbar.js       # Barra de navegación
    │   │   ├── ClientesList.js # Lista de clientes
    │   │   ├── ClienteDetalle.js # Detalle del cliente
    │   │   └── Estadisticas.js # Estadísticas
    │   └── services/
    │       ├── clienteService.js # Llamadas API con Axios
    │       └── exportService.js  # Exportación PDF/Excel
    └── .env                    # Puerto del frontend
```

## 🔧 Instalación y Configuración

### 1. Backend

```powershell
cd C:\Users\Abner\Desktop\Github\GrupoWebAvanzada\7.axios\banco_peluche

# Instalar dependencias (ya instalado)
npm install

# El .env ya está configurado con:
# PORT=3000
# MONGODB_URI=mongodb+srv://...

# Iniciar servidor
npm start
```

El backend estará disponible en `http://localhost:3000`

### 2. Frontend

```powershell
cd C:\Users\Abner\Desktop\Github\GrupoWebAvanzada\7.axios\banco_peluche_react

# Instalar dependencias (ya instalado)
npm install

# Iniciar aplicación React
npm start
```

El frontend estará disponible en `http://localhost:3001`

## 🌐 API Endpoints

### Clientes

- `POST /api/clientes` - Crear un nuevo cliente
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente por ID
- `PUT /api/clientes/:id` - Actualizar un cliente
- `DELETE /api/clientes/:id` - Eliminar un cliente
- `GET /api/clientes/estadisticas` - Obtener estadísticas
- `POST /api/clientes/calcular` - Calcular sin guardar (legacy)

### Ejemplo de Petición POST

```json
{
  "nombre": "Juan Pérez",
  "saldoAnterior": 1000,
  "montoCompras": 500,
  "pagoRealizado": 200
}
```

### Ejemplo de Respuesta

```json
{
  "ok": true,
  "data": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "saldoAnterior": 1000,
    "montoCompras": 500,
    "pagoRealizado": 200,
    "saldoBase": 1300,
    "pagoMinimoBase": 195,
    "esMoroso": false,
    "interes": 0,
    "multa": 0,
    "saldoActual": 1300,
    "pagoMinimo": 195,
    "pagoNoIntereses": 1105,
    "createdAt": "2025-11-20T...",
    "updatedAt": "2025-11-20T..."
  }
}
```

## 🎨 Características del Frontend

### Página Principal (Mis productos)

- Lista de clientes en tarjetas estilo Banco Pichincha
- Indicador visual de clientes morosos (borde rojo + badge)
- Botón "Solicitar nuevo cliente" para agregar
- Botones de exportación (PDF y Excel)
- Botón "Ver detalle" para cada cliente
- Botón "Eliminar" para cada cliente

### Detalle del Cliente

- Información completa del cliente organizada en secciones
- Datos básicos, cálculos y resumen de cuenta
- Aviso especial para clientes morosos
- Botón de exportación individual a PDF
- Navegación de regreso a la lista

### Estadísticas

- Resumen visual con tarjetas de estadísticas
- Gráfico circular (pie chart) de distribución
- Análisis automático y recomendaciones
- Exportación de estadísticas a PDF y Excel

### Diseño

- Colores corporativos: Azul (#003d82) y Amarillo (#ffdd00)
- Diseño responsivo para móviles y tablets
- Efectos hover y transiciones suaves
- Iconos y elementos visuales atractivos

## 📊 Funcionalidades de Exportación

### PDF

- **Lista de clientes**: Tabla con nombre, saldo, estado y pago mínimo
- **Detalle individual**: Información completa de un cliente
- **Estadísticas**: Resumen de totales y porcentajes

### Excel

- **Lista de clientes**: Todas las columnas de datos
- **Estadísticas**: Tabla con totales y porcentajes calculados

## 🔐 Variables de Entorno

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb+srv://adarboleda:adarboleda@cluster0.es09omc.mongodb.net/banco_peluche?retryWrites=true&w=majority
```

### Frontend (.env)

```env
PORT=3001
```

## 📝 Notas Importantes

1. **MongoDB Atlas**: La base de datos está en la nube, no necesita instalación local
2. **CORS**: Configurado para permitir peticiones desde localhost:3001
3. **ES Modules**: El backend usa `type: "module"` en package.json
4. **Cálculos automáticos**: Todos los cálculos se realizan en el servidor
5. **Validaciones**: El nombre del cliente es obligatorio

## 🐛 Solución de Problemas

### Error de conexión a MongoDB

- Verificar que la URI en .env sea correcta
- Verificar conexión a internet
- Revisar logs del servidor: `Conexión exitosa a MongoDB Atlas`

### Error de CORS

- Verificar que el backend esté ejecutándose en puerto 3000
- Verificar que el frontend esté en puerto 3001
- Reiniciar ambos servidores

### Error al exportar PDF/Excel

- Verificar que jspdf y xlsx estén instalados
- Revisar console del navegador para errores

## 👨‍💻 Desarrollo

### Scripts Disponibles

**Backend:**

- `npm start` - Iniciar servidor
- `npm run dev` - Iniciar con nodemon (recarga automática)

**Frontend:**

- `npm start` - Iniciar aplicación React
- `npm run build` - Compilar para producción
- `npm test` - Ejecutar tests

## 📄 Licencia

ISC

## 👥 Autor

Proyecto desarrollado para el curso de Desarrollo Web Avanzado
