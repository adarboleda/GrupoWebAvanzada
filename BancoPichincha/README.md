# Banco Pichincha - Sistema Deuna con MySQL

Sistema bancario con servicios de pago inmediato **TRANSFERIR** y **RECARGA** vía Deuna, migrado a MySQL con Sequelize ORM.

## 📋 Características

- ✅ **Migración de MongoDB a MySQL**: Sistema completamente funcional con Sequelize ORM
- ✅ **Modelo relacional robusto**: Cliente, Cuenta, Tarjeta, Transacción, VinculacionDeuna
- ✅ **Servicio RECARGA**: Recarga de saldo con comisión del 0.5%
- ✅ **Servicio TRANSFERIR**: Transferencias inmediatas con comisión del 1%
- ✅ **Validación de cédula ecuatoriana**: Algoritmo de validación módulo 10
- ✅ **Código DEUNA autogenerado**: Se regenera en cada login
- ✅ **Auditoría completa**: Registro de IP, navegador, estados de transacción
- ✅ **Transacciones atómicas**: Garantiza integridad de datos

## 🗄️ Modelo de Base de Datos

### Tablas

1. **clientes**: Información de clientes bancarios
2. **cuentas**: Cuentas de ahorros/corriente por cliente
3. **tarjetas**: Tarjetas débito/crédito vinculadas a cuentas
4. **transacciones**: Historial completo de operaciones
5. **vinculaciones_deuna**: Información de vinculación para pagos rápidos

### Relaciones

- Cliente → Cuentas (1:N)
- Cliente → Tarjetas (1:N)
- Cuenta → Tarjetas (1:N)
- Cuenta → VinculacionDeuna (1:N)
- Cliente → Transacciones (1:N como origen/destino)
- Cuenta → Transacciones (1:N como origen/destino)

## 🚀 Instalación

### Backend

```bash
cd banco_pichincha_back

# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=banco_deuna
JWT_SECRET=tu_secreto_super_seguro_aqui_2025
NODE_ENV=development

# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE banco_deuna;
exit;

# Ejecutar seeding (crea tablas y datos iniciales)
npm run seed

# Iniciar servidor
npm run dev
```

### Frontend

```bash
cd banco_pichincha_vite

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

## 📊 Datos de Prueba

El script de seeding crea:
- **10 clientes** con sus credenciales
- **15 cuentas** (ahorros y corriente)
- **17 tarjetas** (débito y crédito)
- **10 vinculaciones Deuna**
- **25 transacciones** (recargas y transferencias)

### Credenciales de acceso

Todos los usuarios tienen la contraseña: `password123`

| Usuario | Código Deuna | Nombre |
|---------|--------------|--------|
| juanperez | (autogenerado) | Juan Pérez García |
| mariagonzalez | (autogenerado) | María González López |
| carlosrodriguez | (autogenerado) | Carlos Rodríguez Sánchez |
| anamartinez | (autogenerado) | Ana Martínez Torres |
| luisfernandez | (autogenerado) | Luis Fernández Ruiz |
| patriciadiaz | (autogenerado) | Patricia Díaz Moreno |
| robertovargas | (autogenerado) | Roberto Vargas Castro |
| lauraromero | (autogenerado) | Laura Romero Jiménez |
| diegoherrera | (autogenerado) | Diego Herrera Núñez |
| sofiamendoza | (autogenerado) | Sofia Mendoza Vega |

## 🔌 API Endpoints

### Autenticación

```http
POST /api/clientes/login
Body: { "usuario": "juanperez", "password": "password123" }
```

```http
POST /api/clientes/registro
Body: {
  "nombre": "Nombre Completo",
  "cedula": "1712345678",
  "email": "email@example.com",
  "telefono": "0987654321",
  "usuario": "username",
  "password": "password123"
}
```

### Servicios Deuna

#### SERVICIO RECARGA
```http
POST /api/clientes/:id/recarga
Body: {
  "cuentaId": 1,
  "monto": 100,
  "descripcion": "Recarga de saldo"
}
```

#### SERVICIO TRANSFERIR
```http
POST /api/clientes/:id/transferir-deuna
Body: {
  "cuentaOrigenId": 1,
  "codigoDestino": "A1B2C3D4",
  "monto": 50,
  "descripcion": "Transferencia Deuna"
}
```

### Consultas

```http
GET /api/clientes/:id/transacciones
GET /api/clientes/codigo/:codigoDeuna
GET /api/clientes/:id
GET /api/clientes/estadisticas
```

### Otras operaciones

```http
POST /api/clientes/:id/depositar
POST /api/clientes/:id/transferir
POST /api/clientes/:id/regenerar-codigo
PUT /api/clientes/:id
DELETE /api/clientes/:id
```

## 💡 Características de Deuna

### Registro y Vinculación
- Se crea automáticamente al registrar un cliente
- Vincula cliente con identificador de pago rápido (código Deuna)
- Asocia código a cuenta principal

### Recarga Inmediata
- Comisión: 0.5% del monto
- Validación de cuenta activa
- Actualización de saldo en tiempo real
- Registro de transacción con referencia única

### Transferencia Inmediata
- Comisión: 1% del monto
- Validación de saldo suficiente
- Validación de límites de transferencia
- No permite transferencias a la misma cuenta
- Actualización de saldos en tiempo real
- Transacción atómica (rollback en caso de error)

### Comisiones y Trazabilidad
- Cálculo automático de comisiones
- Generación de comprobante con referencia única
- Auditoría: IP, navegador, timestamps
- Estados: PENDIENTE → CONFIRMADA → FALLIDA/REVERSADA

### Estados y Conciliación
- Estados de transacción: PENDIENTE, CONFIRMADA, FALLIDA, REVERSADA
- Información completa de auditoría
- Historial completo de transacciones por cliente

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- dotenv

### Frontend
- React + TypeScript
- Vite
- Axios
- Lucide Icons

## 📁 Estructura del Proyecto

```
BancoPichincha/
├── banco_pichincha_back/
│   ├── config/
│   │   └── database.js          # Configuración Sequelize
│   ├── models/
│   │   ├── Cliente.js            # Modelo Cliente
│   │   ├── Cuenta.js             # Modelo Cuenta
│   │   ├── Tarjeta.js            # Modelo Tarjeta
│   │   ├── Transaccion.js        # Modelo Transacción
│   │   ├── VinculacionDeuna.js   # Modelo Vinculación Deuna
│   │   └── index.js              # Relaciones y export
│   ├── controllers/
│   │   └── cliente.controller.js
│   ├── services/
│   │   └── cliente.service.js    # Lógica de negocio
│   ├── routes/
│   │   └── cliente.routes.js
│   ├── app.js                    # Aplicación principal
│   ├── seeds.js                  # Script de datos iniciales
│   └── .env                      # Variables de entorno
│
└── banco_pichincha_vite/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.tsx     # Interfaz principal
    │   │   └── Login.tsx         # Login/Registro
    │   ├── services/
    │   │   └── clienteService.ts # Cliente API
    │   └── types/
    │       └── index.ts          # Tipos TypeScript
    └── package.json
```

## 🔒 Validaciones

- Cédula ecuatoriana válida (algoritmo módulo 10)
- Monto mínimo de transacción: $0.01
- Saldo no puede ser negativo
- Código Deuna único de 8 caracteres
- Límites de transferencia por cuenta
- Usuario mínimo 4 caracteres
- Contraseña mínima 6 caracteres

## 📝 Notas

- El código Deuna se regenera automáticamente en cada login para mayor seguridad
- Las transacciones usan transacciones SQL atómicas para garantizar integridad
- Todos los montos se manejan con precisión decimal (15,2)
- Las comisiones se calculan automáticamente en cada operación

## 🎯 Próximas Mejoras

- [ ] Implementar JWT para autenticación
- [ ] Agregar generación de códigos QR
- [ ] Implementar solicitudes de cobro con expiración
- [ ] Añadir notificaciones por email
- [ ] Dashboard de administración
- [ ] Reportes y estadísticas avanzadas

## 📄 Licencia

ISC
