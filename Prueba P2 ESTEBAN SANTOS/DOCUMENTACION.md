# 📊 COVID-19 Tracker USA - Documentación Técnica

**Autor:** Esteban Santos  
**Fecha:** 1 de diciembre de 2025  
**Asignatura:** Programación Web Avanzada

---

## 📋 Índice
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [API REST Utilizada](#api-rest-utilizada)
3. [Parámetros Identificados](#parámetros-identificados)
4. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
5. [Componentes React Implementados](#componentes-react-implementados)
6. [Hooks Utilizados](#hooks-utilizados)
7. [Diseño y Estilos](#diseño-y-estilos)
8. [Flujo de Datos](#flujo-de-datos)
9. [Instalación y Ejecución](#instalación-y-ejecución)
10. [Capturas de Pantalla](#capturas-de-pantalla)

---

## 📝 Descripción del Proyecto

Esta aplicación web desarrollada en **React** consume la API pública de **The COVID Tracking Project** para mostrar datos históricos sobre el COVID-19 en Estados Unidos. La aplicación presenta información de forma visual y organizada mediante componentes reutilizables y un diseño moderno con CSS personalizado.

### Características Principales:
- ✅ Consumo de API REST en la nube
- ✅ Visualización de 5 parámetros clave de COVID-19
- ✅ Uso de hooks React (useState, useEffect)
- ✅ Componentes modulares y reutilizables
- ✅ Diseño responsivo con CSS personalizado
- ✅ Manejo de estados de carga y errores

---

## 🌐 API REST Utilizada

**Nombre:** The COVID Tracking Project API  
**URL Base:** `https://api.covidtracking.com`  
**Endpoint Utilizado:** `/v1/us/daily.json`  
**Método HTTP:** GET  
**Tipo de Respuesta:** JSON

### Descripción de la API:
The COVID Tracking Project API proporciona datos históricos sobre el COVID-19 en Estados Unidos. El endpoint utilizado retorna información diaria con múltiples métricas sobre casos, muertes, hospitalizaciones y pruebas realizadas.

### Ejemplo de Respuesta:
```json
[
  {
    "date": 20210307,
    "positive": 28756489,
    "death": 515148,
    "hospitalized": 776361,
    "recovered": 9507514,
    "totalTestResults": 363825123
  }
]
```

---

## 🔢 Parámetros Identificados

La aplicación utiliza **5 parámetros** extraídos de la API:

### 1. **date** (Fecha)
- **Tipo:** Number (formato YYYYMMDD)
- **Descripción:** Fecha del registro en formato numérico
- **Uso:** Se formatea a DD/MM/YYYY para mostrar en la interfaz
- **Ejemplo:** 20210307 → 07/03/2021

### 2. **positive** (Casos Positivos)
- **Tipo:** Number
- **Descripción:** Total acumulado de casos positivos de COVID-19
- **Uso:** Indicador principal de propagación del virus
- **Visualización:** Formato con separador de miles

### 3. **death** (Muertes)
- **Tipo:** Number
- **Descripción:** Total acumulado de muertes por COVID-19
- **Uso:** Indicador de gravedad y mortalidad
- **Visualización:** Formato con separador de miles

### 4. **hospitalized** (Hospitalizaciones)
- **Tipo:** Number
- **Descripción:** Total acumulado de personas hospitalizadas
- **Uso:** Indicador de la presión sobre el sistema de salud
- **Visualización:** Formato con separador de miles

### 5. **recovered** (Recuperados)
- **Tipo:** Number
- **Descripción:** Total de personas recuperadas del COVID-19
- **Uso:** Indicador positivo de recuperación
- **Visualización:** Formato con separador de miles

### Parámetro Adicional Utilizado:
- **totalTestResults**: Total de pruebas realizadas (para contexto adicional)

### Cálculo Derivado:
- **Tasa de Mortalidad:** Calculada como `(death / positive) * 100`

---

## 🏗️ Arquitectura del Proyecto

```
src/
│
├── App.js                          # Componente principal
├── index.js                        # Punto de entrada
├── index.css                       # Estilos globales
│
├── components/                     # Componentes React
│   ├── productos/
│   │   ├── ProductList.js         # Lista de tarjetas COVID
│   │   ├── ProductCard.js         # Tarjeta individual de datos
│   │   └── Loading.js             # Componente de carga
│   │
│   ├── styles/
│   │   └── style.css
│   └── ui/
│
├── hook/                           # Custom Hooks
│   └── useFetch.js                # Hook para peticiones HTTP
│
├── services/                       # Servicios externos
│   └── productService.js          # Lógica de API
│
└── style/                          # Estilos CSS
    └── app.css                    # Estilos principales
```

### Separación de Responsabilidades:
- **App.js:** Orquestador principal
- **Services:** Lógica de comunicación con la API
- **Hooks:** Lógica reutilizable para fetch de datos
- **Components:** Presentación visual de datos

---

## ⚛️ Componentes React Implementados

### 1. **App.js** (Componente Principal)
```javascript
function App() {
  const { data: covidData, loading, error } = useFetch(getCovidData);
  return (
    <div className="container">
      <div className="header">
        <h1>📊 COVID-19 Tracker USA</h1>
        {/* ... */}
      </div>
      {loading && <Loading />}
      {error && <p className="error-message">⚠️ {error.message}</p>}
      {covidData && <ProductList productos={covidData} />}
    </div>
  );
}
```

**Responsabilidades:**
- Consumir el hook `useFetch` con el servicio `getCovidData`
- Gestionar estados: loading, error, y datos
- Renderizar condicionalmente según el estado
- Proveer la estructura principal de la aplicación

---

### 2. **ProductList.js** (Lista de Tarjetas)
```javascript
function ProductList({ productos }) {
    return (
        <div className="product-grid">
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
}
```

**Responsabilidades:**
- Recibir array de datos por props
- Mapear cada elemento a un componente `ProductCard`
- Aplicar layout de grid

---

### 3. **ProductCard.js** (Tarjeta Individual)
```javascript
function ProductCard({ producto }) {
    const formatDate = (dateString) => { /* ... */ };
    const formatNumber = (num) => { /* ... */ };
    const calculateDeathRate = () => { /* ... */ };

    return (
        <div className="covid-card">
            <div className="card-header">
                <h3>📅 {formatDate(producto.date)}</h3>
            </div>
            <div className="card-content">
                {/* 5 estadísticas principales */}
            </div>
            <div className="card-footer">
                <div className="death-rate">
                    Tasa de Mortalidad: {calculateDeathRate()}%
                </div>
            </div>
        </div>
    );
}
```

**Responsabilidades:**
- Formatear fecha desde YYYYMMDD a DD/MM/YYYY
- Formatear números con separador de miles
- Calcular tasa de mortalidad
- Mostrar 5 parámetros con iconos y estilos diferenciados

---

### 4. **Loading.js** (Componente de Carga)
```javascript
function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">🔄 Cargando datos de COVID-19...</p>
        </div>
    );
}
```

**Responsabilidades:**
- Mostrar spinner animado durante la carga
- Feedback visual al usuario

---

## 🪝 Hooks Utilizados

### 1. **useFetch** (Custom Hook)

```javascript
export function useFetch(asyncCallback) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await asyncCallback();
                setData(response);
            } catch(error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [asyncCallback]);

    return { data, loading, error };
}
```

**Hooks utilizados internamente:**

#### **useState** (3 instancias)
- `data`: Almacena los datos recibidos de la API
- `loading`: Indica si la petición está en curso
- `error`: Almacena errores si ocurren

#### **useEffect**
- Se ejecuta una vez al montar el componente
- Realiza la petición asíncrona a la API
- Actualiza los estados según el resultado

**Ventajas del Custom Hook:**
- ✅ Reutilizable para cualquier función asíncrona
- ✅ Centraliza la lógica de fetch
- ✅ Manejo consistente de estados
- ✅ Separación de responsabilidades

---

## 🎨 Diseño y Estilos

### Tecnologías de Diseño:
- **CSS3 personalizado** (sin Bootstrap para mayor control)
- **Flexbox** para alineación
- **CSS Grid** para layout responsivo
- **Gradientes lineales**
- **Transiciones y animaciones**

### Características del Diseño:

#### 1. **Paleta de Colores:**
- Gradiente morado-azul: `#667eea` → `#764ba2`
- Colores semánticos por métrica:
  - Casos positivos: Rojo (#fc8181)
  - Muertes: Naranja (#f6ad55)
  - Hospitalizados: Verde (#68d391)
  - Recuperados: Azul (#4299e1)
  - Tests: Morado (#9f7aea)

#### 2. **Layout Responsivo:**
```css
.product-grid {
    display: grid;
    gap: 25px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```
- Se adapta automáticamente al tamaño de pantalla
- En móviles: 1 columna
- En tablets: 2 columnas
- En desktop: 3-4 columnas

#### 3. **Efectos Interactivos:**
- **Hover en tarjetas:** Elevación y sombra
- **Hover en estadísticas:** Desplazamiento lateral
- **Animación de spinner:** Rotación continua

#### 4. **Accesibilidad:**
- Contraste adecuado de colores
- Tamaños de fuente legibles
- Iconos descriptivos (emojis)

---

## 🔄 Flujo de Datos

```
1. Usuario accede a la aplicación
         ↓
2. App.js se monta y ejecuta useFetch(getCovidData)
         ↓
3. useFetch ejecuta useEffect
         ↓
4. Se llama a getCovidData() (productService.js)
         ↓
5. fetch() hace petición GET a la API
         ↓
6. API responde con JSON
         ↓
7. Se parsea y retorna solo 30 registros
         ↓
8. useFetch actualiza estado 'data'
         ↓
9. App.js recibe datos y los pasa a ProductList
         ↓
10. ProductList mapea datos a ProductCard
         ↓
11. ProductCard formatea y muestra cada registro
         ↓
12. Usuario ve las tarjetas renderizadas
```

### Manejo de Estados:

**Estado: Loading**
```
loading = true → Muestra <Loading />
loading = false → Oculta spinner
```

**Estado: Error**
```
error = null → No muestra mensaje
error = objeto → Muestra mensaje de error
```

**Estado: Data**
```
data = null → No renderiza tarjetas
data = array → Renderiza ProductList
```

---

## 💻 Instalación y Ejecución

### Requisitos Previos:
- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación:

```bash
# 1. Clonar o descargar el proyecto
cd "Prueba P2 ESTEBAN SANTOS"

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start

# 4. La aplicación se abrirá en:
# http://localhost:3000
```

### Scripts Disponibles:

```json
"scripts": {
    "start": "react-scripts start",      // Desarrollo
    "build": "react-scripts build",      // Producción
    "test": "react-scripts test",        // Tests
    "eject": "react-scripts eject"       // Eject
}
```

---

## 📸 Capturas de Pantalla

### Vista Principal:
```
┌─────────────────────────────────────────────────┐
│   📊 COVID-19 Tracker USA                       │
│   Datos históricos de seguimiento de COVID-19  │
│   en Estados Unidos                             │
│   🔬 Fuente: The COVID Tracking Project         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │📅 Fecha  │  │📅 Fecha  │  │📅 Fecha  │     │
│  │          │  │          │  │          │     │
│  │🦠 Casos  │  │🦠 Casos  │  │🦠 Casos  │     │
│  │💀 Muertes│  │💀 Muertes│  │💀 Muertes│     │
│  │🏥 Hosp.  │  │🏥 Hosp.  │  │🏥 Hosp.  │     │
│  │✅ Recup. │  │✅ Recup. │  │✅ Recup. │     │
│  │🔬 Tests  │  │🔬 Tests  │  │🔬 Tests  │     │
│  │          │  │          │  │          │     │
│  │Mortalidad│  │Mortalidad│  │Mortalidad│     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Estado de Carga:
- Spinner animado
- Mensaje "Cargando datos de COVID-19..."

### Características Visuales:
- ✅ Diseño moderno con gradientes
- ✅ Tarjetas elevadas con sombras
- ✅ Iconos descriptivos para cada métrica
- ✅ Colores diferenciados por tipo de dato
- ✅ Animaciones suaves en hover
- ✅ Layout responsivo para todos los dispositivos

---

## ✅ Cumplimiento de Criterios

### 1. Consumo de API REST (0.5 puntos)
- ✅ Conexión exitosa a `https://api.covidtracking.com`
- ✅ Petición GET implementada
- ✅ Uso de fetch con async/await
- ✅ Manejo de respuesta JSON
- ✅ Manejo de errores

### 2. Identificación de 3-5 Parámetros (0.5 puntos)
- ✅ 5 parámetros identificados: date, positive, death, hospitalized, recovered
- ✅ Parámetros mostrados correctamente en frontend
- ✅ Tipos de datos interpretados (Number, String formateado)
- ✅ Explicación detallada en documentación

### 3. Desarrollo con Componentes (1 punto)
- ✅ useState implementado en useFetch (3 instancias)
- ✅ useEffect implementado para carga de datos
- ✅ 4 componentes creados: App, ProductList, ProductCard, Loading
- ✅ Código organizado en carpetas
- ✅ Render dinámico de datos desde API

### 4. Documentación y Diseño (1 punto)
- ✅ CSS personalizado con diseño moderno
- ✅ Interfaz limpia y organizada
- ✅ Sistema de cards responsive
- ✅ Documentación completa en Markdown
- ✅ Explicación técnica detallada

---

## 🎯 Conclusiones

Esta aplicación demuestra:

1. **Consumo efectivo de APIs REST** mediante fetch y async/await
2. **Arquitectura modular** con separación de responsabilidades
3. **Uso avanzado de React Hooks** (useState, useEffect, custom hook)
4. **Diseño responsivo y atractivo** con CSS moderno
5. **Buenas prácticas** de desarrollo web

La aplicación es funcional, escalable y cumple con todos los requisitos especificados en la prueba.

---

**Fin de la Documentación**

*Desarrollado por: Esteban Santos*  
*Fecha: 1 de diciembre de 2025*  
*Programación Web Avanzada*
