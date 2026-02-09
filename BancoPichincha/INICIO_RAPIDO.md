# 🚀 Guía de Inicio Rápido - Banco Pichincha Deuna

## Requisitos Previos

- ✅ Node.js v18+ instalado
- ✅ MySQL Server 8.0+ instalado y corriendo
- ✅ Git (opcional)

## Paso 1: Preparar MySQL

### Opción A: Usar MySQL Workbench

1. Abrir MySQL Workbench
2. Conectarse al servidor local
3. Ejecutar el siguiente comando:

```sql
CREATE DATABASE banco_deuna;
```

### Opción B: Usar línea de comandos

```bash
mysql -u root -p
# Ingresar contraseña
CREATE DATABASE banco_deuna;
exit;
```

## Paso 2: Configurar Backend

### 1. Navegar al directorio backend

```bash
cd c:\Users\Abner\Desktop\Github\GrupoWebAvanzada\BancoPichincha\banco_pichincha_back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar archivo .env

Asegurarse que el archivo `.env` contiene:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Colocar tu contraseña de MySQL
DB_NAME=banco_deuna
JWT_SECRET=tu_secreto_super_seguro_aqui_2025
NODE_ENV=development
```

**⚠️ IMPORTANTE**: Si tu MySQL tiene contraseña, agrégala en `DB_PASSWORD=`

### 4. Crear tablas y datos iniciales

```bash
npm run seed
```

Esto creará:

- ✅ 10 clientes de prueba
- ✅ 15 cuentas bancarias
- ✅ 17 tarjetas
- ✅ 10 vinculaciones Deuna
- ✅ 25 transacciones de ejemplo

### 5. Iniciar servidor backend

```bash
npm run dev
```

Deberías ver:

```
✅ Conexión a MySQL establecida correctamente
Base de datos sincronizada correctamente
🚀 Servidor Banco Pichincha escuchando en http://localhost:3000
```

## Paso 3: Configurar Frontend

### 1. Abrir nueva terminal y navegar al directorio frontend

```bash
cd c:\Users\Abner\Desktop\Github\GrupoWebAvanzada\BancoPichincha\banco_pichincha_vite
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar aplicación frontend

```bash
npm run dev
```

Deberías ver:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Paso 4: Probar la Aplicación

### 1. Abrir navegador en http://localhost:5173

### 2. Iniciar sesión con alguna cuenta de prueba:

| Usuario         | Contraseña  |
| --------------- | ----------- |
| juanperez       | password123 |
| mariagonzalez   | password123 |
| carlosrodriguez | password123 |

### 3. Probar funcionalidades:

#### ✅ Servicio RECARGA

1. Clic en "Depositar"
2. Ingresar monto (ej: 100)
3. Clic en "Confirmar"
4. Verificar que se añade con comisión del 0.5%

#### ✅ Servicio TRANSFERIR

1. Clic en "Transferir"
2. Buscar destinatario con código Deuna de otro usuario
3. Ingresar monto
4. Confirmar transferencia
5. Verificar que se descuenta con comisión del 1%

#### ✅ Ver Historial

- El dashboard muestra todas las transacciones
- Se puede ver si son RECARGA o TRANSFERENCIA
- Muestra comisiones y estados

## Solución de Problemas

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Solución**: Agregar tu contraseña de MySQL en `.env`:

```env
DB_PASSWORD=tu_contraseña_mysql
```

### ❌ Error: "Unknown database 'banco_deuna'"

**Solución**: Crear la base de datos manualmente:

```sql
mysql -u root -p
CREATE DATABASE banco_deuna;
exit;
```

### ❌ Error: "Port 3000 already in use"

**Solución**: Cambiar puerto en `.env`:

```env
PORT=3001
```

Y actualizar en frontend `src/services/clienteService.ts`:

```typescript
const API_URL = 'http://localhost:3001/api/clientes';
```

### ❌ Error: "ECONNREFUSED" al hacer login

**Solución**: Verificar que el backend esté corriendo en http://localhost:3000

### ❌ No se ven transacciones

**Solución**: Ejecutar nuevamente el seeding:

```bash
npm run seed
```

## Verificar que Todo Funciona

### 1. Backend funcionando

```bash
# Abrir http://localhost:3000/api/clientes/estadisticas
# Deberías ver estadísticas JSON
```

### 2. Frontend funcionando

```bash
# Abrir http://localhost:5173
# Deberías ver la pantalla de login
```

### 3. Base de datos poblada

```sql
mysql -u root -p
USE banco_deuna;
SELECT COUNT(*) FROM clientes;  -- Debería retornar 10
SELECT COUNT(*) FROM cuentas;   -- Debería retornar ~15
SELECT COUNT(*) FROM transacciones; -- Debería retornar ~25
```

## Comandos Útiles

### Backend

```bash
npm run dev      # Iniciar en modo desarrollo
npm start        # Iniciar en modo producción
npm run seed     # Recrear base de datos con datos iniciales
```

### Frontend

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Crear build de producción
npm run preview  # Previsualizar build
```

### MySQL

```bash
mysql -u root -p
USE banco_deuna;
SHOW TABLES;                    # Ver todas las tablas
SELECT * FROM clientes;         # Ver clientes
SELECT * FROM transacciones;    # Ver transacciones
CALL sp_estadisticas_generales(); # Ver estadísticas
```

## Probar los Servicios Deuna con Postman

### Login

```http
POST http://localhost:3000/api/clientes/login
Content-Type: application/json

{
  "usuario": "juanperez",
  "password": "password123"
}
```

### Servicio RECARGA

```http
POST http://localhost:3000/api/clientes/1/recarga
Content-Type: application/json

{
  "cuentaId": 1,
  "monto": 100,
  "descripcion": "Recarga de prueba"
}
```

### Servicio TRANSFERIR

```http
POST http://localhost:3000/api/clientes/1/transferir-deuna
Content-Type: application/json

{
  "cuentaOrigenId": 1,
  "codigoDestino": "CODIGO_DEUNA_DESTINO",
  "monto": 50,
  "descripcion": "Transferencia de prueba"
}
```

## ✅ Todo Listo!

Si llegaste hasta aquí y todo funciona, tu sistema está completamente operativo con:

- ✅ Backend en MySQL con Sequelize
- ✅ Servicios RECARGA y TRANSFERIR funcionando
- ✅ Frontend React + TypeScript
- ✅ 10 clientes de prueba
- ✅ Datos iniciales cargados
- ✅ Validaciones y comisiones activas

## 🎯 Próximos Pasos

1. Explorar el código en `models/` para entender las relaciones
2. Revisar `services/cliente.service.js` para ver la lógica de negocio
3. Modificar comisiones en los métodos `recargaSaldo` y `transferirDeuna`
4. Agregar más validaciones según necesites
5. Personalizar el frontend en `components/Dashboard.tsx`

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación completa
- [database_schema.sql](./database_schema.sql) - Esquema de base de datos
- Sequelize Docs: https://sequelize.org/docs/v6/
- React + TypeScript: https://react-typescript-cheatsheet.netlify.app/
