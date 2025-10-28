# Empleados-ORM (backend)

Pequeña API basada en Express + Sequelize para el laboratorio de ventas y salarios.

Endpoints principales:
- `GET /` -> mensaje de prueba
- `GET /api/obreros` y CRUD sobre `obreros` (ya incluido)
- `GET /api/obreros/:id/salario` -> calcular salario semanal (ya incluido)
- `POST /api/ventas` -> procesar un arreglo de montos y retornar conteos y totales por categoría

Ejemplo de uso de `POST /api/ventas`:

Request body (JSON):

{
  "ventas": [120.5, 600, 1500, 499]
}

Response (ahora retorna `N` y `CN` acorde a la tabla del enunciado):

{
  "N": 4,
  "CN": 4,
  "A": 1,
  "B": 1,
  "C": 2,
  "T1": 1500,
  "T2": 600,
  "T3": 619.5,
  "TT": 2720
}

Instrucciones rápidas:
1. Copia `.env.example` a `.env` y llena los datos.
2. Instala dependencias: `npm install` en la carpeta `empleados-orm`.
3. Ejecuta en modo desarrollo: `npm run dev` (requiere `nodemon` instalado como devDependency).
