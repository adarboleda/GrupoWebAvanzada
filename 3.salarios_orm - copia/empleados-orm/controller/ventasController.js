// Controller para procesar ventas diarias y clasificar por rangos
// Ajustado para retornar las variables según la tabla del enunciado: N, CN, A, B, C, T1, T2, T3, TT
export const procesarVentas = (req, res) => {
  try {
    const { ventas } = req.body;
    if (!ventas || !Array.isArray(ventas)) {
      return res
        .status(400)
        .json({ error: "Se requiere un arreglo 'ventas' con montos numéricos" });
    }

    // Validación estricta: todas las entradas deben poder convertirse a número finito
    for (let i = 0; i < ventas.length; i++) {
      const monto = Number(ventas[i]);
      if (!Number.isFinite(monto)) {
        return res.status(400).json({
          error: `Entrada inválida en índice ${i}: valor='${ventas[i]}' no es numérico`,
        });
      }
    }

    // Inicializar variables según la tabla
    const N = ventas.length; // Número de ventas
    let CN = 0; // Contador de las ventas procesadas (se incrementa por cada venta válida)

    let A = 0; // Ventas mayores a mil
    let B = 0; // Ventas >500 y <=1000
    let C = 0; // Ventas <=500

    let T1 = 0; // Total ventas tipo A
    let T2 = 0; // Total ventas tipo B
    let T3 = 0; // Total ventas tipo C

    for (const v of ventas) {
      const monto = Number(v);
      // Contador de ventas (CN)
      CN += 1;

      if (monto > 1000) {
        A += 1;
        T1 += monto;
      } else if (monto > 500) {
        B += 1;
        T2 += monto;
      } else {
        C += 1;
        T3 += monto;
      }
    }

    const TT = T1 + T2 + T3; // Total general

    return res.json({ N, CN, A, B, C, T1, T2, T3, TT });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
