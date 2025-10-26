# 📐 Diagrama Nassi-Shneiderman (N/S)

## Diagrama N/S Completo - Sistema de Ventas Tiki Taka

```
╔═══════════════════════════════════════════════════════════════════════╗
║                            INICIO                                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║ Inicializar variables:                                                ║
║ CN ← 0, A ← 0, B ← 0, C ← 0                                          ║
║ T1 ← 0.0, T2 ← 0.0, T3 ← 0.0, TT ← 0.0                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║ Leer N (número de ventas)                                            ║
╠═══════════════════════════════════════════════════════════════════════╣
║                          MIENTRAS CN < N                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║                          CN ← CN + 1                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║                     Leer V (monto de venta)                           ║
╠══════════════════════════════╤════════════════════════════════════════╣
║         V > 1000             │          V ≤ 1000                      ║
╠══════════════════════════════╪════════════════════════════════════════╣
║  • A ← A + 1                 │            V > 500                     ║
║  • T1 ← T1 + V               ╞═════════════════╤══════════════════════╣
║  • tipo ← 'A'                │  V > 500        │    V ≤ 500           ║
║  • Guardar en BD             ╞═════════════════╪══════════════════════╣
║                              │  • B ← B + 1    │  • C ← C + 1         ║
║                              │  • T2 ← T2 + V  │  • T3 ← T3 + V       ║
║                              │  • tipo ← 'B'   │  • tipo ← 'C'        ║
║                              │  • Guardar BD   │  • Guardar BD        ║
╠══════════════════════════════╧═════════════════╧══════════════════════╣
║                        TT ← TT + V                                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║                    Mostrar clasificación al usuario                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                          FIN MIENTRAS                                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║ Mostrar resultados:                                                   ║
║ • Total de ventas: CN                                                 ║
║ • Ventas Tipo A: A (Total: T1)                                       ║
║ • Ventas Tipo B: B (Total: T2)                                       ║
║ • Ventas Tipo C: C (Total: T3)                                       ║
║ • Total General: TT                                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                              FIN                                      ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Diagrama N/S por Capas MVC

### Capa MODELO - VentasModel.crearVenta()

```
╔═══════════════════════════════════════════════════════════════════════╗
║                   FUNCIÓN: CrearVenta(monto)                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║                     Recibir parámetro: monto                          ║
╠══════════════════════════════╤════════════════════════════════════════╣
║        monto > 1000          │         monto ≤ 1000                   ║
╠══════════════════════════════╪════════════════════════════════════════╣
║     tipo ← 'A'               │          monto > 500                   ║
║                              ╞══════════════════╤═════════════════════╣
║                              │  tipo ← 'B'      │  tipo ← 'C'         ║
╠══════════════════════════════╧══════════════════╧═════════════════════╣
║  query ← "INSERT INTO ventas (monto, tipo, fecha)                     ║
║           VALUES (?, ?, NOW())"                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  resultado ← EJECUTAR_SQL(query, [monto, tipo])                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  RETORNAR {                                                           ║
║    id: resultado.insertId,                                            ║
║    monto: monto,                                                      ║
║    tipo: tipo,                                                        ║
║    success: true                                                      ║
║  }                                                                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║                          FIN FUNCIÓN                                  ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Capa CONTROLADOR - VentasController.crearVenta()

```
╔═══════════════════════════════════════════════════════════════════════╗
║            FUNCIÓN: CrearVenta(solicitud, respuesta)                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║           monto ← solicitud.body.monto                                ║
╠══════════════════════════════╤════════════════════════════════════════╣
║  monto ≤ 0 O NO_ES_NÚMERO    │         monto > 0 Y ES_NÚMERO          ║
╠══════════════════════════════╪════════════════════════════════════════╣
║  RETORNAR respuesta.error    │  resultado ← VentasModel.             ║
║  (400, "Monto inválido")     │            CrearVenta(monto)           ║
║                              ╞════════════════════════════════════════╣
║                              │  RETORNAR respuesta.json({             ║
║                              │    success: true,                      ║
║                              │    message: "Venta registrada",        ║
║                              │    data: resultado                     ║
║                              │  })                                    ║
╠══════════════════════════════╧════════════════════════════════════════╣
║                          FIN FUNCIÓN                                  ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Capa VISTA - FormularioVenta (React)

```
╔═══════════════════════════════════════════════════════════════════════╗
║              COMPONENTE: FormularioVenta                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Estado inicial:                                                      ║
║  • monto ← ""                                                         ║
║  • loading ← false                                                    ║
║  • mensaje ← ""                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                FUNCIÓN: handleSubmit(evento)                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║              evento.preventDefault()                                  ║
╠══════════════════════════════╤════════════════════════════════════════╣
║       monto ≤ 0              │           monto > 0                    ║
╠══════════════════════════════╪════════════════════════════════════════╣
║  mensaje ← "Monto inválido"  │  loading ← true                        ║
║  RETORNAR                    │  mensaje ← ""                          ║
║                              ╞════════════════════════════════════════╣
║                              │  resultado ← API.POST(                 ║
║                              │    '/api/ventas',                      ║
║                              │    { monto: monto }                    ║
║                              │  )                                     ║
║                              ╞══════════════╤═════════════════════════╣
║                              │ resultado.   │  resultado.             ║
║                              │ success      │  error                  ║
║                              ╞══════════════╪═════════════════════════╣
║                              │ mensaje ←    │  mensaje ←              ║
║                              │ "✅ Venta    │  "❌ Error"             ║
║                              │ registrada"  │                         ║
║                              │ monto ← ""   │                         ║
║                              │ Actualizar   │                         ║
║                              │ datos        │                         ║
╠══════════════════════════════╧══════════════╧═════════════════════════╣
║                    loading ← false                                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║  RENDERIZAR:                                                          ║
║  • Input (monto)                                                      ║
║  • Botón ("Registrar Venta")                                         ║
║  • Mensaje (mensaje)                                                  ║
║  • Información de clasificación                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                       FIN COMPONENTE                                  ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Diagrama N/S - Flujo Completo MVC

```
╔═══════════════════════════════════════════════════════════════════════╗
║                      FLUJO COMPLETO MVC                               ║
╠═══════════════════════════════════════════════════════════════════════╣
║  VISTA (React): Usuario ingresa monto en formulario                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  VISTA (React): onClick "Registrar Venta"                             ║
╠═══════════════════════════════════════════════════════════════════════╣
║  VISTA (React): Validar monto > 0                                     ║
╠══════════════════════════════╤════════════════════════════════════════╣
║      monto ≤ 0               │           monto > 0                    ║
╠══════════════════════════════╪════════════════════════════════════════╣
║  Mostrar error               │  VISTA → API:                          ║
║  RETORNAR                    │  POST /api/ventas                      ║
║                              │  Body: { monto }                       ║
╠══════════════════════════════╧════════════════════════════════════════╣
║  API → CONTROLADOR: VentasController.crearVenta()                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║  CONTROLADOR: Validar y extraer monto                                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║  CONTROLADOR → MODELO: VentasModel.crearVenta(monto)                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║  MODELO: Clasificar venta (A, B o C)                                  ║
╠══════════════════════════════╤════════════════════════════════════════╣
║       monto > 1000           │         monto ≤ 1000                   ║
╠══════════════════════════════╪════════════════════════════════════════╣
║     tipo ← 'A'               │          monto > 500                   ║
║                              ╞══════════════════╤═════════════════════╣
║                              │  tipo ← 'B'      │  tipo ← 'C'         ║
╠══════════════════════════════╧══════════════════╧═════════════════════╣
║  MODELO → BD: INSERT INTO ventas (monto, tipo, fecha)                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║  BD → MODELO: Retornar id de venta insertada                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║  MODELO → CONTROLADOR: Retornar { id, monto, tipo, success }          ║
╠═══════════════════════════════════════════════════════════════════════╣
║  CONTROLADOR → API: JSON Response { success, data }                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║  API → VISTA: Respuesta JSON                                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║  VISTA: Actualizar interfaz                                           ║
║  • Mostrar mensaje de éxito                                           ║
║  • Actualizar estadísticas                                            ║
║  • Agregar venta a tabla                                              ║
║  • Limpiar formulario                                                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║                            FIN FLUJO                                  ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Características del Diagrama N/S

### Ventajas del Diagrama Nassi-Shneiderman

1. **Estructuración clara**: Muestra la estructura del programa de forma visual
2. **Sin GOTO**: Elimina las bifurcaciones no estructuradas
3. **Bloques anidados**: Las estructuras de control se representan mediante bloques anidados
4. **Fácil lectura**: Se lee de arriba hacia abajo, de izquierda a derecha

### Elementos del Diagrama

| Elemento | Representación | Uso |
|----------|----------------|-----|
| Proceso simple | Rectángulo | Instrucciones secuenciales |
| Decisión | División horizontal | IF-THEN-ELSE |
| Iteración | Marco con condición arriba | WHILE, FOR |
| Selección múltiple | División vertical múltiple | SWITCH-CASE |

### Aplicación en el Proyecto

- **Secuencial**: Inicialización de variables, lecturas
- **Condicional**: Clasificación de ventas (A, B, C)
- **Iterativo**: Procesamiento de N ventas
- **Modular**: Separación por capas MVC

## Notación Utilizada

```
╔═══╗  Inicio/Fin de bloque
║   ║  Proceso
╠═══╣  Separador
╞═══╡  División de decisión
│   │  Flujo
```

## Ejemplo de Ejecución

**Entrada:**
- N = 3 (tres ventas)
- Venta 1: $1500
- Venta 2: $750
- Venta 3: $450

**Proceso:**
```
Venta 1: $1500 → tipo 'A' → A=1, T1=$1500
Venta 2: $750  → tipo 'B' → B=1, T2=$750
Venta 3: $450  → tipo 'C' → C=1, T3=$450
```

**Salida:**
- Ventas tipo A: 1 (Total: $1500)
- Ventas tipo B: 1 (Total: $750)
- Ventas tipo C: 1 (Total: $450)
- Total general: $2700
