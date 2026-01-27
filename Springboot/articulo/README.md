# Sistema de Gestión de Artículos y Rubros

Sistema completo de gestión de artículos con categorización por rubros, implementado con Spring Boot y MySQL.

## Características

- **Gestión de Rubros (Categorías)**: CRUD completo de categorías
- **Gestión de Artículos**: CRUD completo con relación a rubros
- **Relación OneToMany/ManyToOne**: Un rubro puede tener muchos artículos, un artículo pertenece a un solo rubro
- **API REST**: Endpoints completos para integración
- **Frontend**: Interfaz web para gestionar artículos y rubros

## Tecnologías Utilizadas

- Spring Boot 4.0.2
- Spring Data JPA
- MySQL
- HTML5, CSS3, JavaScript (Vanilla)

## Modelo de Datos

### Rubro

- `id` (Long): Identificador único
- `nombre` (String): Nombre de la categoría
- `articulos` (List<Articulo>): Lista de artículos asociados

### Artículo

- `id` (Long): Identificador único
- `nombre` (String): Nombre del artículo
- `precio` (Double): Precio del artículo
- `descripcion` (String): Descripción del artículo
- `rubro` (Rubro): Categoría a la que pertenece

## Configuración

### Base de Datos

Actualiza el archivo `application.properties` con tu configuración de MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3096/articulos_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

## Endpoints de la API

### Rubros

- **GET** `/api/rubros` - Obtener todos los rubros
- **GET** `/api/rubros/{id}` - Obtener un rubro por ID
- **POST** `/api/rubros` - Crear un nuevo rubro
- **PUT** `/api/rubros/{id}` - Actualizar un rubro
- **DELETE** `/api/rubros/{id}` - Eliminar un rubro

### Artículos

- **GET** `/api/articulos` - Obtener todos los artículos
- **GET** `/api/articulos/con-rubro` - Obtener todos los artículos con información del rubro
- **GET** `/api/articulos/{id}` - Obtener un artículo por ID
- **POST** `/api/articulos` - Crear un nuevo artículo
- **PUT** `/api/articulos/{id}` - Actualizar un artículo
- **DELETE** `/api/articulos/{id}` - Eliminar un artículo

## Ejemplos de Uso con Postman

### Crear un Rubro

```json
POST http://localhost:8081/api/rubros
Content-Type: application/json

{
    "nombre": "Electrónica"
}
```

### Crear un Artículo

```json
POST http://localhost:8081/api/articulos
Content-Type: application/json

{
    "nombre": "Laptop Dell XPS 15",
    "precio": 1299.99,
    "descripcion": "Laptop de alto rendimiento con procesador Intel i7",
    "rubroId": 1
}
```

## Ejecución del Proyecto

1. Asegúrate de tener MySQL ejecutándose
2. Ejecuta el proyecto Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
3. Accede a la aplicación web en: `http://localhost:8081`
4. Accede a la API en: `http://localhost:8081/api`

## Frontend

El sistema incluye una interfaz web completa que permite:

- Agregar nuevos rubros (categorías)
- Ver lista de todos los rubros
- Eliminar rubros
- Agregar nuevos artículos con su rubro
- Ver lista de todos los artículos con su categoría
- Eliminar artículos

Accede al frontend en: `http://localhost:8081/index.html`

## Pruebas con Postman

Importa la colección de Postman incluida en `postman/Articulos.postman_collection.json` para probar todos los endpoints de la API.

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/articulo/articulo/
│   │   ├── controller/
│   │   │   ├── ArticuloController.java
│   │   │   └── RubroController.java
│   │   ├── model/
│   │   │   ├── Articulo.java
│   │   │   └── Rubro.java
│   │   ├── repository/
│   │   │   ├── ArticuloRepository.java
│   │   │   └── RubroRepository.java
│   │   ├── service/
│   │   │   ├── ArticuloService.java
│   │   │   └── RubroService.java
│   │   └── ArticuloApplication.java
│   └── resources/
│       ├── static/
│       │   ├── index.html
│       │   ├── index.js
│       │   └── estilos.css
│       └── application.properties
└── test/
```

## Autor

Grupo Web Avanzada
