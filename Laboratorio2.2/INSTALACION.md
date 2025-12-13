# 📦 Guía de Instalación - Sistema de Seguros Vehiculares

Esta guía te llevará paso a paso para instalar y configurar el sistema completo.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** v14 o superior ([Descargar](https://nodejs.org/))
- ✅ **MySQL** v5.7 o superior ([Descargar](https://dev.mysql.com/downloads/mysql/))
- ✅ **pnpm** (recomendado) o npm
  ```bash
  npm install -g pnpm
  ```
- ✅ **Git** (opcional, para clonar el repositorio)

## 🚀 Pasos de Instalación

### 1️⃣ Descargar o Clonar el Proyecto

```bash
# Si tienes Git instalado
git clone <url-del-repositorio>
cd Laboratorio2.2

# O descargar el ZIP y extraerlo
```

---

### 2️⃣ Configurar la Base de Datos MySQL

#### Paso 2.1: Iniciar MySQL

Asegúrate de que MySQL esté corriendo en tu sistema.

```bash
# En Windows (si MySQL está en servicios)
# Abre "Servicios" y verifica que MySQL esté ejecutándose

# O inicia MySQL manualmente
mysql.server start  # En macOS/Linux
```

#### Paso 2.2: Crear la Base de Datos

Conéctate a MySQL y ejecuta:

```bash
mysql -u root -p
# Ingresa tu contraseña de MySQL
```

Dentro de MySQL, ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS SegurosVehiculares;
USE SegurosVehiculares;
```

#### Paso 2.3: Ejecutar el Script SQL

Hay dos opciones:

**Opción A: Desde MySQL CLI**

```sql
SOURCE /ruta/completa/al/proyecto/seguro-vehicular-orm/database.sql;
```

**Opción B: Importar el archivo**

```bash
mysql -u root -p SegurosVehiculares < seguro-vehicular-orm/database.sql
```

Esto creará todas las tablas necesarias:

- `Conductor`
- `Vehiculo`
- `Cotizacion`
- `Pago`
- `Usuario`

Y también insertará datos de prueba para conductores y vehículos.

---

### 3️⃣ Configurar el Backend

#### Paso 3.1: Navegar al directorio del backend

```bash
cd seguro-vehicular-orm
```

#### Paso 3.2: Instalar dependencias

```bash
pnpm install
# O si usas npm
npm install
```

Esto instalará:

- express
- sequelize
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- cookie-parser

#### Paso 3.3: Configurar variables de entorno

Crea o edita el archivo `.env` en la carpeta `seguro-vehicular-orm`:

```bash
# Crear el archivo .env
touch .env  # En macOS/Linux
# O créalo manualmente en Windows
```

Contenido del archivo `.env`:

```env
# Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=SegurosVehiculares
DB_DIALECT=mysql

# Puerto del Servidor
PORT=3000

# Clave secreta para JWT (cambia esto en producción)
JWT_SECRET=seguros_vehiculares_secret_key_2025
```

**⚠️ IMPORTANTE:** Reemplaza `tu_password_mysql` con la contraseña de tu MySQL.

#### Paso 3.4: Crear Usuario Administrador

Ejecuta el script para crear el usuario administrador inicial:

```bash
node src/scripts/crearUsuarioAdmin.js
```

Deberías ver:

```
[dotenv@17.2.3] injecting env (7) from .env
Usuario admin creado exitosamente:
Username: admin
Password: admin123
Rol: ADMIN
```

**Credenciales del Administrador:**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

⚠️ **Recomendación:** Cambia esta contraseña después del primer inicio de sesión.

#### Paso 3.5: Iniciar el Servidor Backend

```bash
node app.js
```

Deberías ver:

```
🚗 Sistema de Cotización de Seguro Vehicular
🌐 Servidor ejecutándose en el puerto 3000
🔗 URL: http://localhost:3000

📍 Endpoints disponibles:
   - POST   /api/conductores
   - GET    /api/conductores
   ...
```

✅ **El backend está listo!** Deja esta terminal abierta y corriendo.

---

### 4️⃣ Configurar el Frontend

#### Paso 4.1: Abrir una NUEVA terminal

No cierres la terminal del backend. Abre una nueva terminal.

#### Paso 4.2: Navegar al directorio del frontend

```bash
cd Front\ Taller
# O en Windows
cd "Front Taller"
```

#### Paso 4.3: Instalar dependencias

```bash
pnpm install
# O si usas npm
npm install
```

Esto instalará:

- next (13.4.9)
- react
- primereact
- primeicons
- primeflex
- axios
- typescript

**⏳ Nota:** Este paso puede tomar varios minutos dependiendo de tu conexión.

#### Paso 4.4: Iniciar el Servidor de Desarrollo

```bash
pnpm dev
# O si usas npm
npm run dev
```

Deberías ver:

```
> avalon-react@10.1.0 dev
> next dev

- warn Port 3000 is in use, trying 3001 instead.
- ready started server on 0.0.0.0:3001, url: http://localhost:3001
- event compiled client and server successfully
```

✅ **El frontend está listo!** El sistema está usando el puerto 3001 porque el 3000 está ocupado por el backend.

---

### 5️⃣ Acceder al Sistema

#### Paso 5.1: Abrir el Navegador

Navega a: **http://localhost:3001**

Serás redirigido automáticamente a la página de login.

#### Paso 5.2: Iniciar Sesión

Usa las credenciales del administrador:

- **Usuario:** `admin`
- **Contraseña:** `admin123`

#### Paso 5.3: Explorar el Sistema

Una vez dentro, verás:

1. **Dashboard** - Estadísticas generales
2. **Gestión**
   - Conductores - CRUD de conductores
   - Vehículos - CRUD de vehículos
3. **Cotizaciones**
   - Nueva Cotización - Calculadora
   - Historial - Ver todas las cotizaciones
4. **Pagos** - Gestionar pagos y reintentos
5. **Administración** (solo para ADMIN)
   - Usuarios - Gestionar usuarios del sistema

---

## 🧪 Probar el Sistema

### Crear un Conductor

1. Ve a **Gestión → Conductores**
2. Clic en **Nuevo Conductor**
3. Completa los datos:
   - Identificación: `1717171717`
   - Nombre: `María González`
   - Fecha Nacimiento: `2001-08-20` (23 años)
   - Email: `maria@ejemplo.com`
   - Número Accidentes: `0`
4. Guardar

### Crear un Vehículo

1. Ve a **Gestión → Vehículos**
2. Clic en **Nuevo Vehículo**
3. Completa los datos:
   - Marca: `Toyota`
   - Modelo: `Corolla`
   - Año: `2020`
   - Placa: `ABC-1234`
   - Valor: `18000`
   - Tipo: `SEDAN`
   - Uso: `PERSONAL`
4. Guardar

### Crear una Cotización

1. Ve a **Cotizaciones → Nueva Cotización**
2. Selecciona el conductor: `María González`
3. Selecciona el vehículo: `Toyota Corolla`
4. El sistema calculará automáticamente:
   - Costo base: $660
   - Descuento sin accidentes: -$66
   - Recargo joven (18-24): +$148.50
   - **Total: $742.50**
5. Acepta términos y condiciones
6. Clic en **Calcular Cotización**

### Procesar un Pago

1. Ve a **Pagos → Gestionar Pagos**
2. Verás el pago pendiente de la cotización
3. Clic en **Procesar Pago**
4. Selecciona:
   - Tipo Tarjeta: `CREDITO`
   - Modalidad: `CONTADO`
   - Cuotas: `1`
5. Clic en **Procesar**

---

## 🔐 Crear Usuarios Adicionales (Solo ADMIN)

1. Ve a **Administración → Usuarios**
2. Clic en **Nuevo Usuario**
3. Completa:
   - Usuario: `operador1`
   - Nombre: `Juan Pérez`
   - Email: `juan@seguros.com`
   - Contraseña: `password123`
   - Rol: `OPERADOR`
4. Guardar

Ahora este usuario puede iniciar sesión, pero NO verá la opción de Administración.

---

## 🛑 Detener el Sistema

### Detener el Frontend

En la terminal del frontend, presiona: `Ctrl + C`

### Detener el Backend

En la terminal del backend, presiona: `Ctrl + C`

---

## 🔄 Reiniciar el Sistema

Para volver a iniciar todo:

### Terminal 1 - Backend

```bash
cd seguro-vehicular-orm
node app.js
```

### Terminal 2 - Frontend

```bash
cd "Front Taller"
pnpm dev
```

---

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"

**Problema:** El backend no puede conectarse a MySQL.

**Solución:**

1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `.env`
3. Asegúrate de que la base de datos `SegurosVehiculares` exista
4. Verifica el puerto (por defecto 3306)

```bash
# Probar conexión
mysql -u root -p
```

### Error: "Port 3000 is already in use"

**Problema:** Otro proceso está usando el puerto 3000.

**Solución:**

1. Detén el proceso que está usando el puerto
2. O cambia el puerto en `.env`:
   ```env
   PORT=3001
   ```

### Error: "Token inválido" o "No autorizado"

**Problema:** El token JWT expiró o es inválido.

**Solución:**

1. Cierra sesión
2. Vuelve a iniciar sesión
3. Si persiste, limpia el localStorage del navegador:
   ```javascript
   // En la consola del navegador
   localStorage.clear();
   ```

### Error: "Module not found"

**Problema:** Faltan dependencias.

**Solución:**

```bash
# En la carpeta correspondiente
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### El frontend no muestra datos

**Problema:** El backend no está corriendo o hay error de CORS.

**Solución:**

1. Verifica que el backend esté en `http://localhost:3000`
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que el frontend esté apuntando a la URL correcta en `apiService.ts`

### Error al crear usuario administrador: "Ya existe"

**Problema:** El usuario admin ya fue creado.

**Solución:**
Esto es normal si ya ejecutaste el script antes. Puedes:

1. Usar las credenciales existentes: `admin` / `admin123`
2. O eliminar el usuario desde MySQL y volver a crear:
   ```sql
   DELETE FROM Usuario WHERE username = 'admin';
   ```
   Luego ejecuta nuevamente: `node src/scripts/crearUsuarioAdmin.js`

---

## 📚 Recursos Adicionales

- [README.md](./seguro-vehicular-orm/README.md) - Documentación completa del proyecto
- [database.sql](./seguro-vehicular-orm/database.sql) - Schema de la base de datos
- [API Tests](./seguro-vehicular-orm/api-tests.http) - Ejemplos de llamadas al API

---

## 🆘 Soporte

Si encuentras algún problema durante la instalación:

1. Verifica que todos los requisitos estén instalados correctamente
2. Revisa los logs en las terminales del backend y frontend
3. Consulta la sección de **Solución de Problemas** arriba
4. Verifica que los puertos 3000 y 3001 estén disponibles

---

## ✅ Lista de Verificación

Antes de considerar la instalación completa, verifica:

- [ ] MySQL está corriendo
- [ ] Base de datos `SegurosVehiculares` creada
- [ ] Tablas creadas desde `database.sql`
- [ ] Backend instalado (`pnpm install` en `seguro-vehicular-orm`)
- [ ] Archivo `.env` configurado con credenciales correctas
- [ ] Usuario admin creado (`node src/scripts/crearUsuarioAdmin.js`)
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend instalado (`pnpm install` en `Front Taller`)
- [ ] Frontend corriendo en puerto 3001
- [ ] Puedes iniciar sesión con `admin` / `admin123`
- [ ] Puedes navegar por todas las secciones

---

¡Felicidades! 🎉 El sistema está completamente instalado y funcionando.
