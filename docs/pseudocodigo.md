# 📝 Pseudocódigo - Sistema de Ventas Tiki Taka

## Pseudocódigo Principal del Sistema

```
ALGORITMO SistemaVentasTikiTaka

// ==================== DECLARACIÓN DE VARIABLES ====================

VARIABLES:
    N: Real              // Número total de ventas del día
    CN: Real             // Contador de ventas procesadas
    A: Entero            // Cantidad de ventas tipo A (> $1000)
    B: Entero            // Cantidad de ventas tipo B ($500 - $1000)
    C: Entero            // Cantidad de ventas tipo C (≤ $500)
    V: Real              // Monto de cada venta individual
    T1: Real             // Total acumulado de ventas tipo A
    T2: Real             // Total acumulado de ventas tipo B
    T3: Real             // Total acumulado de ventas tipo C
    TT: Real             // Total general de todas las ventas
    tipo: Cadena         // Tipo de venta ('A', 'B' o 'C')

// ==================== INICIALIZACIÓN ====================

INICIO
    // Inicializar contadores y acumuladores
    CN ← 0
    A ← 0
    B ← 0
    C ← 0
    T1 ← 0.0
    T2 ← 0.0
    T3 ← 0.0
    TT ← 0.0
    
    // Leer el número total de ventas del día
    ESCRIBIR "Ingrese el número de ventas del día:"
    LEER N
    
    // Validar que N sea positivo
    MIENTRAS N <= 0 HACER
        ESCRIBIR "Error: El número de ventas debe ser mayor a 0"
        LEER N
    FIN_MIENTRAS

// ==================== PROCESAMIENTO DE VENTAS ====================

    // Ciclo para procesar cada venta
    MIENTRAS CN < N HACER
        // Incrementar contador
        CN ← CN + 1
        
        // Leer el monto de la venta
        ESCRIBIR "Ingrese el monto de la venta #", CN, ":"
        LEER V
        
        // Validar que el monto sea positivo
        MIENTRAS V <= 0 HACER
            ESCRIBIR "Error: El monto debe ser mayor a 0"
            LEER V
        FIN_MIENTRAS
        
        // Clasificar la venta y actualizar contadores
        SI V > 1000 ENTONCES
            // Venta tipo A: Mayor a $1000
            A ← A + 1
            T1 ← T1 + V
            tipo ← 'A'
            ESCRIBIR "Venta clasificada como Tipo A"
        SINO
            SI V > 500 ENTONCES
                // Venta tipo B: Mayor a $500 pero ≤ $1000
                B ← B + 1
                T2 ← T2 + V
                tipo ← 'B'
                ESCRIBIR "Venta clasificada como Tipo B"
            SINO
                // Venta tipo C: Menor o igual a $500
                C ← C + 1
                T3 ← T3 + V
                tipo ← 'C'
                ESCRIBIR "Venta clasificada como Tipo C"
            FIN_SI
        FIN_SI
        
        // Acumular en el total general
        TT ← TT + V
        
        // Guardar venta en base de datos
        LLAMAR GuardarVentaEnBD(V, tipo)
        
    FIN_MIENTRAS

// ==================== PRESENTACIÓN DE RESULTADOS ====================

    ESCRIBIR "=========================================="
    ESCRIBIR "    RESUMEN DE VENTAS - TIKI TAKA"
    ESCRIBIR "=========================================="
    ESCRIBIR ""
    ESCRIBIR "Total de ventas procesadas: ", CN
    ESCRIBIR ""
    ESCRIBIR "--- VENTAS POR CATEGORÍA ---"
    ESCRIBIR "Tipo A (> $1000):"
    ESCRIBIR "  Cantidad: ", A, " ventas"
    ESCRIBIR "  Total: $", T1
    ESCRIBIR ""
    ESCRIBIR "Tipo B ($500 - $1000):"
    ESCRIBIR "  Cantidad: ", B, " ventas"
    ESCRIBIR "  Total: $", T2
    ESCRIBIR ""
    ESCRIBIR "Tipo C (≤ $500):"
    ESCRIBIR "  Cantidad: ", C, " ventas"
    ESCRIBIR "  Total: $", T3
    ESCRIBIR ""
    ESCRIBIR "--- TOTAL GENERAL ---"
    ESCRIBIR "Total de ventas: $", TT
    ESCRIBIR "=========================================="

FIN

// ==================== FUNCIONES AUXILIARES ====================

FUNCIÓN GuardarVentaEnBD(monto: Real, tipo: Cadena)
    // Esta función se ejecuta en el MODELO (MySQL)
    SQL_QUERY ← "INSERT INTO ventas (monto, tipo, fecha) VALUES (?, ?, NOW())"
    EJECUTAR_SQL(SQL_QUERY, [monto, tipo])
FIN_FUNCIÓN

FUNCIÓN ObtenerEstadisticas()
    // Esta función se ejecuta en el MODELO
    SQL_QUERY ← "
        SELECT 
            COUNT(*) as total_ventas,
            SUM(CASE WHEN tipo = 'A' THEN 1 ELSE 0 END) as ventas_tipo_a,
            SUM(CASE WHEN tipo = 'B' THEN 1 ELSE 0 END) as ventas_tipo_b,
            SUM(CASE WHEN tipo = 'C' THEN 1 ELSE 0 END) as ventas_tipo_c,
            SUM(CASE WHEN tipo = 'A' THEN monto ELSE 0 END) as total_tipo_a,
            SUM(CASE WHEN tipo = 'B' THEN monto ELSE 0 END) as total_tipo_b,
            SUM(CASE WHEN tipo = 'C' THEN monto ELSE 0 END) as total_tipo_c,
            SUM(monto) as total_general
        FROM ventas
    "
    RETORNAR EJECUTAR_SQL(SQL_QUERY)
FIN_FUNCIÓN
```

## Pseudocódigo por Capa MVC

### MODELO (VentasModel.js)

```
CLASE VentasModel

    FUNCIÓN CrearVenta(monto: Real)
        // Clasificar la venta
        SI monto > 1000 ENTONCES
            tipo ← 'A'
        SINO SI monto > 500 ENTONCES
            tipo ← 'B'
        SINO
            tipo ← 'C'
        FIN_SI
        
        // Insertar en base de datos
        query ← "INSERT INTO ventas (monto, tipo, fecha) VALUES (?, ?, NOW())"
        resultado ← EJECUTAR_SQL(query, [monto, tipo])
        
        RETORNAR {
            id: resultado.insertId,
            monto: monto,
            tipo: tipo,
            success: true
        }
    FIN_FUNCIÓN
    
    FUNCIÓN ObtenerTodasVentas()
        query ← "SELECT * FROM ventas ORDER BY fecha DESC"
        ventas ← EJECUTAR_SQL(query)
        RETORNAR ventas
    FIN_FUNCIÓN
    
    FUNCIÓN ObtenerEstadisticas()
        query ← "SELECT COUNT(*) as total_ventas, 
                        SUM(CASE WHEN tipo='A' THEN 1 ELSE 0 END) as ventas_tipo_a,
                        SUM(CASE WHEN tipo='B' THEN 1 ELSE 0 END) as ventas_tipo_b,
                        SUM(CASE WHEN tipo='C' THEN 1 ELSE 0 END) as ventas_tipo_c,
                        SUM(CASE WHEN tipo='A' THEN monto ELSE 0 END) as total_tipo_a,
                        SUM(CASE WHEN tipo='B' THEN monto ELSE 0 END) as total_tipo_b,
                        SUM(CASE WHEN tipo='C' THEN monto ELSE 0 END) as total_tipo_c,
                        SUM(monto) as total_general
                 FROM ventas"
        estadisticas ← EJECUTAR_SQL(query)
        RETORNAR estadisticas[0]
    FIN_FUNCIÓN
    
    FUNCIÓN EliminarTodasVentas()
        query ← "DELETE FROM ventas"
        EJECUTAR_SQL(query)
        RETORNAR { success: true }
    FIN_FUNCIÓN

FIN_CLASE
```

### CONTROLADOR (VentasController.js)

```
CLASE VentasController

    FUNCIÓN CrearVenta(solicitud, respuesta)
        // Extraer datos de la solicitud
        monto ← solicitud.body.monto
        
        // Validar entrada
        SI monto <= 0 O NO_ES_NUMERO(monto) ENTONCES
            RETORNAR respuesta.error(400, "Monto inválido")
        FIN_SI
        
        // Llamar al modelo
        resultado ← VentasModel.CrearVenta(monto)
        
        // Retornar respuesta JSON
        RETORNAR respuesta.json({
            success: true,
            message: "Venta registrada exitosamente",
            data: resultado
        })
    FIN_FUNCIÓN
    
    FUNCIÓN ObtenerVentas(solicitud, respuesta)
        // Llamar al modelo
        ventas ← VentasModel.ObtenerTodasVentas()
        
        // Retornar respuesta JSON
        RETORNAR respuesta.json({
            success: true,
            data: ventas
        })
    FIN_FUNCIÓN
    
    FUNCIÓN ObtenerEstadisticas(solicitud, respuesta)
        // Llamar al modelo
        estadisticas ← VentasModel.ObtenerEstadisticas()
        
        // Retornar respuesta JSON
        RETORNAR respuesta.json({
            success: true,
            data: estadisticas
        })
    FIN_FUNCIÓN
    
    FUNCIÓN EliminarVentas(solicitud, respuesta)
        // Llamar al modelo
        VentasModel.EliminarTodasVentas()
        
        // Retornar respuesta JSON
        RETORNAR respuesta.json({
            success: true,
            message: "Todas las ventas han sido eliminadas"
        })
    FIN_FUNCIÓN

FIN_CLASE
```

### VISTA (FormularioVenta.js - React)

```
COMPONENTE FormularioVenta

    VARIABLES_ESTADO:
        monto: Cadena ← ""
        loading: Booleano ← false
        mensaje: Cadena ← ""
    
    FUNCIÓN handleSubmit(evento)
        evento.preventDefault()
        
        // Validar entrada
        SI monto <= 0 ENTONCES
            mensaje ← "Por favor ingresa un monto válido"
            RETORNAR
        FIN_SI
        
        loading ← true
        mensaje ← ""
        
        // Llamar API (Controlador)
        resultado ← LLAMAR_API("POST", "/api/ventas", { monto: monto })
        
        SI resultado.success ENTONCES
            mensaje ← "Venta registrada: $" + resultado.data.monto + " - Tipo " + resultado.data.tipo
            monto ← ""
            LLAMAR onVentaCreada()  // Actualizar datos
        SINO
            mensaje ← "Error al registrar la venta"
        FIN_SI
        
        loading ← false
    FIN_FUNCIÓN
    
    RENDERIZAR:
        MOSTRAR_FORMULARIO(
            Campo(monto, onChange),
            Botón("Registrar Venta", onClick: handleSubmit),
            Mensaje(mensaje)
        )
    FIN_RENDERIZAR

FIN_COMPONENTE
```

## Complejidad del Algoritmo

- **Temporal:** O(n) donde n es el número de ventas
- **Espacial:** O(1) - espacio constante para variables
- **Operaciones críticas:** 
  - Clasificación: O(1) por venta
  - Inserción BD: O(1) por venta
  - Consulta estadísticas: O(n) en BD

## Casos de Uso

### Caso 1: Venta Tipo A
```
ENTRADA: V = 1500
PROCESO: 
    V > 1000 → verdadero
    A = A + 1 = 1
    T1 = T1 + 1500 = 1500
    TT = TT + 1500 = 1500
    tipo = 'A'
SALIDA: "Venta tipo A registrada"
```

### Caso 2: Venta Tipo B
```
ENTRADA: V = 750
PROCESO:
    V > 1000 → falso
    V > 500 → verdadero
    B = B + 1 = 1
    T2 = T2 + 750 = 750
    TT = TT + 750 = 750
    tipo = 'B'
SALIDA: "Venta tipo B registrada"
```

### Caso 3: Venta Tipo C
```
ENTRADA: V = 450
PROCESO:
    V > 1000 → falso
    V > 500 → falso
    C = C + 1 = 1
    T3 = T3 + 450 = 450
    TT = TT + 450 = 450
    tipo = 'C'
SALIDA: "Venta tipo C registrada"
```
