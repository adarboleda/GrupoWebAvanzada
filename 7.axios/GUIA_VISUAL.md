# 🎨 Guía Visual - Banco Peluche

## 📱 Páginas Implementadas

### 1. 🏠 Página Principal - "Mis productos"

**Ruta**: `http://localhost:3001/`

**Elementos Visuales**:

```
┌─────────────────────────────────────────────────────────────────┐
│  🏦 BANCO PICHINCHA    [Mis productos] [Estadísticas]  👤 Mi perfil │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mis productos                                                  │
│  ┌────────────────┬────────────────┬────────────────┐         │
│  │ [Solicitar]    │ [Exportar PDF] │ [Exportar Excel]│         │
│  └────────────────┴────────────────┴────────────────┘         │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │     🏦     │  │     🏦     │  │     🏦     │           │
│  │             │  │             │  │  [MOROSO]  │           │
│  │ Juan Pérez  │  │ Ana López   │  │ Carlos Ruiz│           │
│  │             │  │             │  │             │           │
│  │ Saldo: $1200│  │ Saldo: $2500│  │ Saldo: $3224│          │
│  │ Pago: $180  │  │ Pago: $375  │  │ Pago: $483.6│          │
│  │ Estado: ✅  │  │ Estado: ✅  │  │ Estado: ⚠️ │          │
│  │             │  │             │  │             │           │
│  │ [Ver detalle]│  │ [Ver detalle]│  │ [Ver detalle]│         │
│  │ [Eliminar]  │  │ [Eliminar]  │  │ [Eliminar]  │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Colores**:

- Navbar: Azul oscuro (#003d82)
- Botones principales: Azul (#003d82)
- Botones exportar: Amarillo (#ffdd00)
- Tarjetas: Blanco con sombra
- Badge MOROSO: Rojo (#ff4444)
- Borde tarjeta morosa: Rojo

---

### 2. 📊 Estadísticas

**Ruta**: `http://localhost:3001/estadisticas`

**Elementos Visuales**:

```
┌─────────────────────────────────────────────────────────────────┐
│  🏦 BANCO PICHINCHA    [Mis productos] [Estadísticas]  👤 Mi perfil │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ← Volver        Estadísticas de Clientes                      │
│                  [Exportar PDF] [Exportar Excel]                │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │     📊     │  │     ⚠️     │  │     ✅     │           │
│  │ Total de    │  │ Clientes    │  │ Clientes    │           │
│  │ Clientes    │  │ Morosos     │  │ al Día      │           │
│  │             │  │             │  │             │           │
│  │     10      │  │      3      │  │      7      │           │
│  │             │  │  30% total  │  │  70% total  │           │
│  │             │  │ ▓▓▓▓░░░░░░ │  │ ▓▓▓▓▓▓▓░░░ │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  Distribución de Clientes                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              ╱───╲                                       │  │
│  │           ╱         ╲      ■ Clientes al Día           │  │
│  │          │    10     │       7 (70%)                    │  │
│  │          │   Total   │                                  │  │
│  │           ╲         ╱      ■ Clientes Morosos          │  │
│  │              ╲───╱           3 (30%)                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Análisis                                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Estado General                                           │  │
│  │ ⚠️ Hay un porcentaje considerable de clientes morosos.  │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Recomendación                                            │  │
│  │ Se recomienda realizar seguimiento a los 3 clientes     │  │
│  │ morosos.                                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Colores**:

- Tarjeta Total: Borde azul (#003d82)
- Tarjeta Morosos: Borde rojo (#ff4444)
- Tarjeta Al Día: Borde verde (#4caf50)
- Gráfico: Verde (#4caf50) y Rojo (#ff4444)

---

### 3. 📄 Detalle del Cliente

**Ruta**: `http://localhost:3001/cliente/:id`

**Elementos Visuales**:

```
┌─────────────────────────────────────────────────────────────────┐
│  🏦 BANCO PICHINCHA    [Mis productos] [Estadísticas]  👤 Mi perfil │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ← Volver        Detalle del Cliente   [Descargar PDF]         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │   👤   Carlos Ruiz Gómez              [CLIENTE MOROSO]  │  │
│  │        Fecha de registro: 20/11/2025                     │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  Información Básica                                       │  │
│  │  ┌──────────────┬──────────────┬──────────────┬────────┐│  │
│  │  │Saldo Anterior│Monto Compras │Pago Realizado│Saldo   ││  │
│  │  │   $2,000.00  │   $1,000.00  │    $300.00   │Base    ││  │
│  │  │              │              │              │$2,700  ││  │
│  │  └──────────────┴──────────────┴──────────────┴────────┘│  │
│  │                                                           │  │
│  │  Cálculos y Estado                                        │  │
│  │  ┌──────────────┬──────────────┬──────────────┬────────┐│  │
│  │  │Pago Mínimo   │Estado de Pago│Interés (12%) │Multa   ││  │
│  │  │Base (15%)    │              │              │        ││  │
│  │  │   $405.00    │   ⚠️ Moroso  │    $324.00   │ $200.00││  │
│  │  └──────────────┴──────────────┴──────────────┴────────┘│  │
│  │                                                           │  │
│  │  Resumen de Cuenta                                        │  │
│  │  ┌──────────────────────────────────────────────────────┐│  │
│  │  │         Saldo Actual            $3,224.00           ││  │
│  │  │  Pago Mínimo Requerido (15%)     $483.60           ││  │
│  │  │  Pago Sin Intereses (85%)       $2,740.40          ││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  │                                                           │  │
│  │  ⚠️ Aviso Importante                                      │  │
│  │  Este cliente está en estado de morosidad. Se han       │  │
│  │  aplicado los siguientes cargos:                         │  │
│  │  • Interés del 12% sobre el saldo base: $324.00        │  │
│  │  • Multa por mora: $200.00                              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Colores**:

- Secciones info: Gris claro (#f8f9fa)
- Sección resumen: Azul (#003d82) con texto blanco
- Valores destacados: Amarillo (#ffdd00)
- Aviso: Amarillo claro (#fff3cd) con borde naranja

---

## 🎨 Paleta de Colores

```css
/* Colores Principales */
#003d82  /* Azul Banco Pichincha - Navbar, botones principales */
#ffdd00  /* Amarillo corporativo - Botones, destacados */

/* Colores de Estado */
#ff4444  /* Rojo - Moroso, errores, eliminar */
#4caf50  /* Verde - Al día, éxito */
#ff9800  /* Naranja - Advertencias */

/* Colores de Fondo */
#f5f5f5  /* Gris muy claro - Fondo página */
#f8f9fa  /* Gris claro - Tarjetas información */
#ffffff  /* Blanco - Tarjetas principales */

/* Colores de Texto */
#1a1a1a  /* Negro suave - Texto principal */
#666666  /* Gris medio - Texto secundario */
#999999  /* Gris claro - Texto terciario */
```

---

## 🔤 Tipografía

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;

/* Tamaños */
h1: 32px - Títulos principales
h2: 24px - Subtítulos
h3: 20px - Títulos de tarjetas
h4: 18px - Subsecciones
p:  14px - Texto normal
```

---

## 📐 Espaciado y Dimensiones

```css
/* Bordes redondeados */
border-radius: 4px  - Botones, inputs
border-radius: 8px  - Tarjetas
border-radius: 50% - Íconos circulares

/* Sombras */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)   - Normal
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) - Hover

/* Espaciado */
padding: 12px 24px - Botones
padding: 24px      - Tarjetas
gap: 24px          - Grid
```

---

## 🎭 Efectos y Animaciones

### Hover en Tarjetas

```css
transform: translateY(-4px)
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
transition: 0.3s
```

### Hover en Botones

```css
background-color: darker shade
transition: 0.3s
```

### Barras de Progreso

```css
width: percentage%
transition: width 0.5s ease
```

---

## 📱 Responsive Design

### Desktop (>768px)

- Grid 3 columnas para tarjetas
- Navbar horizontal completo
- Formulario 3 columnas

### Mobile (<768px)

- Grid 1 columna
- Navbar vertical apilado
- Formulario 1 columna
- Botones width: 100%

---

## 🧩 Componentes Reutilizables

### Botón Primario (Azul)

```jsx
className="btn-nuevo"
background: #003d82
color: white
```

### Botón Secundario (Amarillo)

```jsx
className="btn-export"
background: #ffdd00
color: #1a1a1a
```

### Botón Peligro (Rojo)

```jsx
className="btn-eliminar"
background: #ff4444
color: white
```

### Badge Moroso

```jsx
className="badge-moroso"
background: #ff4444
color: white
border-radius: 12px
padding: 4px 12px
```

### Tarjeta Cliente

```jsx
className="cliente-card"
border-left: 4px solid (color según estado)
box-shadow: 0 2px 8px rgba(0,0,0,0.1)
```

---

## ✨ Iconos Utilizados

```
🏦 - Logo banco / Alcancía
👤 - Usuario / Perfil
📊 - Estadísticas totales
⚠️ - Advertencia moroso
✅ - Estado correcto
```

---

**Inspiración**: Diseño basado en la interfaz de Banco Pichincha
**Herramientas**: React + CSS personalizado (sin frameworks UI)
**Responsive**: Totalmente adaptable a móviles y tablets
