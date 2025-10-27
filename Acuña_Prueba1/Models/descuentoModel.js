export default {
	// total: número > 0, numero: número (requerido)
	calcularDescuento(total, numero) {
		const t = Number(total);
		const n = Number(numero);

		// Validaciones: total debe ser numérico y positivo; numero debe ser numérico y > 0
		if (!isFinite(t) || t <= 0) return null;
		if (!isFinite(n) || n <= 0) return null;

		const porcentaje = (n < 74) ? 0.15 : 0.20;
		const monto = Math.round(t * porcentaje * 100) / 100; // 2 decimales
		const totalConDescuento = Math.round((t - monto) * 100) / 100;
		return { total: t, numero: n, porcentaje, monto, totalConDescuento };
	}
};
