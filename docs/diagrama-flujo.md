# 📊 Diagrama de Flujo - Sistema de Ventas Tiki Taka

## Diagrama Principal del Sistema

```
                            ┌─────────────────┐
                            │     INICIO      │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │  Inicializar    │
                            │   Variables:    │
                            │  N, CN, A, B,   │
                            │  C, T1, T2, T3  │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │  Leer número    │
                            │  de ventas (N)  │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │   CN = 0        │
                            └────────┬────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │       CN < N?                   │
                    │       (¿Hay ventas pendientes?) │
                    └──┬──────────────────────────┬───┘
                       │ NO                       │ SÍ
                       │                          │
                       │                   ┌──────▼─────────┐
                       │                   │ CN = CN + 1    │
                       │                   └──────┬─────────┘
                       │                          │
                       │                   ┌──────▼─────────┐
                       │                   │ Leer monto (V) │
                       │                   └──────┬─────────┘
                       │                          │
                       │                   ┌──────▼─────────┐
                       │                   │   V > 1000?    │
                       │                   └──┬─────────┬───┘
                       │                      │ SÍ      │ NO
                       │                      │         │
                       │                 ┌────▼───┐     │
                       │                 │ A = A+1│     │
                       │                 │T1=T1+V │     │
                       │                 │Tipo='A'│     │
                       │                 └────┬───┘     │
                       │                      │         │
                       │                      │    ┌────▼────────┐
                       │                      │    │  V > 500?   │
                       │                      │    └──┬──────┬───┘
                       │                      │       │ SÍ   │ NO
                       │                      │  ┌────▼───┐  │
                       │                      │  │ B = B+1│  │
                       │                      │  │T2=T2+V │  │
                       │                      │  │Tipo='B'│  │
                       │                      │  └────┬───┘  │
                       │                      │       │      │
                       │                      │       │ ┌────▼───┐
                       │                      │       │ │ C = C+1│
                       │                      │       │ │T3=T3+V │
                       │                      │       │ │Tipo='C'│
                       │                      │       │ └────┬───┘
                       │                      │       │      │
                       │                      └───────┴──────┘
                       │                              │
                       │                   ┌──────────▼─────────┐
                       │                   │    TT = TT + V     │
                       │                   └──────────┬─────────┘
                       │                              │
                       │                   ┌──────────▼─────────┐
                       │                   │ Guardar venta en BD│
                       │                   │  (Modelo → MySQL)  │
                       │                   └──────────┬─────────┘
                       │                              │
                       │                   ┌──────────▼─────────┐
                       │                   │ Mostrar resultado  │
                       │                   │  (Vista → React)   │
                       │                   └──────────┬─────────┘
                       │                              │
                       └──────────────────────────────┘
                                     │
                            ┌────────▼────────┐
                            │ Mostrar Resumen:│
                            │   A ventas tipo │
                            │   B ventas tipo │
                            │   C ventas tipo │
                            │   T1, T2, T3    │
                            │   TT (Total)    │
                            └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │      FIN        │
                            └─────────────────┘
```

## Flujo de Datos MVC

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO MVC                        │
└──────────────────────────────────────────────────────────────┘

1. USUARIO → VISTA (React)
   │
   ├─> Ingresa monto en formulario
   │
   └─> onClick "Registrar Venta"
           │
           ▼
2. VISTA → CONTROLADOR (API REST)
   │
   ├─> POST http://localhost:3000/api/ventas
   │
   └─> Body: { "monto": 1500 }
           │
           ▼
3. CONTROLADOR → MODELO
   │
   ├─> VentasController.crearVenta()
   │
   └─> Llama a VentasModel.crearVenta(monto)
           │
           ▼
4. MODELO → BASE DE DATOS
   │
   ├─> Clasifica: tipo = monto > 1000 ? 'A' : (monto > 500 ? 'B' : 'C')
   │
   └─> INSERT INTO ventas (monto, tipo, fecha) VALUES (1500, 'A', NOW())
           │
           ▼
5. BASE DE DATOS → MODELO
   │
   └─> Retorna: { id: 123, monto: 1500, tipo: 'A' }
           │
           ▼
6. MODELO → CONTROLADOR
   │
   └─> Retorna resultado
           │
           ▼
7. CONTROLADOR → VISTA
   │
   └─> Response JSON: { success: true, data: {...} }
           │
           ▼
8. VISTA → USUARIO
   │
   ├─> Actualiza estadísticas
   ├─> Agrega fila a tabla
   └─> Muestra mensaje de éxito
```

## Diagrama de Clasificación de Ventas

```
              Monto de Venta (V)
                     │
           ┌─────────┴─────────┐
           │                   │
      ┌────▼─────┐      ┌──────▼──────┐
      │ V > 1000?│      │  V ≤ 1000?  │
      └────┬─────┘      └──────┬──────┘
           │                   │
        ┌──▼──┐         ┌──────▼──────┐
        │ SÍ  │         │  V > 500?   │
        └──┬──┘         └──┬───────┬──┘
           │               │ SÍ    │ NO
    ┌──────▼──────┐  ┌─────▼────┐ │
    │  TIPO A     │  │  TIPO B  │ │
    │  A = A + 1  │  │ B = B + 1│ │
    │  T1 = T1+V  │  │ T2=T2+V  │ │
    │  (> $1000)  │  │($500-$1k)│ │
    └─────────────┘  └──────────┘ │
                                  │
                          ┌───────▼─────┐
                          │   TIPO C    │
                          │  C = C + 1  │
                          │  T3 = T3+V  │
                          │  (≤ $500)   │
                          └─────────────┘
```

## Diagrama de Estados del Sistema

```
┌────────────────┐
│   INACTIVO     │
└───────┬────────┘
        │ Usuario accede
        │
┌───────▼────────┐
│  CARGANDO      │ ← Consulta BD
│   DATOS        │
└───────┬────────┘
        │
┌───────▼────────┐
│     LISTO      │ ← Muestra interfaz
│   (Idle)       │
└───┬────────┬───┘
    │        │
    │        └──────────┐
    │                   │
    │            ┌──────▼────────┐
    │            │  REGISTRANDO  │
    │            │     VENTA     │
    │            └──────┬────────┘
    │                   │
    │            ┌──────▼────────┐
    │            │  ACTUALIZANDO │
    │            │  ESTADÍSTICAS │
    │            └──────┬────────┘
    │                   │
    └───────────────────┘
```

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ┌─┐     | Proceso     |
| ◇       | Decisión    |
| →       | Flujo       |
| ┌───┐   | Inicio/Fin  |
| │...│   | Datos       |

## Notas Importantes

1. **Ciclo Principal**: El sistema usa un ciclo MIENTRAS (while) que se repite hasta procesar todas las N ventas
2. **Clasificación**: La decisión de clasificación se hace mediante condicionales anidados (if-else if-else)
3. **Acumuladores**: Se usan variables acumuladoras (T1, T2, T3, TT) para sumar los totales
4. **Persistencia**: Cada venta se guarda inmediatamente en la base de datos
5. **Tiempo Real**: Las estadísticas se actualizan automáticamente en la vista
