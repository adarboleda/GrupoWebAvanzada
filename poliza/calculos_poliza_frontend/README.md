# Calculadora de Póliza de Seguros - Frontend

Frontend en React para la aplicación de cálculo de pólizas de seguros desarrollada con Spring Boot.

## Características

- ✅ Formulario complejo con 2 secciones (Propietario y Vehículo)
- ✅ Validación de datos en tiempo real
- ✅ Combobox precargado con modelos de vehículos (A, B, C)
- ✅ Interfaz responsive y moderna
- ✅ Información contextual para cada modelo
- ✅ Visualización de resultados elegante
- ✅ Manejo de errores

## Requisitos

- Node.js 14+
- npm 6+

## Instalación

```bash
cd calculos_poliza_frontend
npm install
```

## Ejecución

Asegúrate de que el servidor Spring Boot esté corriendo en `http://localhost:8087`

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/
│   ├── CalculadoraPoliza.js      # Componente principal
│   ├── CalculadoraPoliza.css
│   ├── PropietarioForm.js        # Formulario de propietario
│   ├── PropietarioForm.css
│   ├── AutomovilForm.js          # Formulario de vehículo
│   ├── AutomovilForm.css
│   ├── Resultado.js              # Componente de resultado
│   └── Resultado.css
├── App.js
├── App.css
├── index.js
└── index.css
```

## Flujo de la Aplicación

1. **Sección de Propietario**: Ingrese nombre, edad y número de accidentes
2. **Sección de Vehículo**: Seleccione modelo y valor del vehículo
3. **Validación**: La aplicación valida todos los campos
4. **Cálculo**: Se envía la solicitud al backend
5. **Resultado**: Se muestra el costo total de la póliza

## Validaciones Implementadas

### Propietario
- Nombre: Requerido, 2-100 caracteres
- Edad: 18-120 años
- Accidentes: Número no negativo

### Vehículo
- Modelo: A, B o C (selección en combobox)
- Valor: Mayor a $0.01

## Construcción para Producción

```bash
npm run build
```

Esto crea una carpeta `build` optimizada lista para producción.

## Tecnologías Utilizadas

- React 18
- Axios para solicitudes HTTP
- CSS3 con Flexbox y Grid
- Responsive Design

## API Endpoints Usados

- `POST /api/poliza/calcular` - Calcular póliza con datos JSON
