export function vistaFormulario() {
	return `
		<h1>Promoción de Descuento</h1>
		<form id="descuentoForm" method="POST" action="/descuento/calcular">
			<label>Total de la compra: <input id="total" type="number" step="0.01" name="total"></label><br>
			<label>Número: <input id="numero" type="number" name="numero" required></label><br>
			<button type="submit">Calcular Descuento</button>
		</form>
	`;
}

export function vistaResultado({ total, numero, porcentaje, monto, totalConDescuento }) {
	const pct = (porcentaje * 100).toFixed(0) + "%";
	return `
		<h1>Resultado del Descuento</h1>
		<p><b>Total:</b> $${total.toFixed(2)}</p>
		<p><b>Número escogido:</b> ${numero}</p>
		<p><b>Porcentaje aplicado:</b> ${pct}</p>
		<p><b>Monto descontado:</b> $${monto.toFixed(2)}</p>
		<p><b>Total con descuento:</b> $${totalConDescuento.toFixed(2)}</p>
		<a href="/descuento"> <-Volver</a>
	`;
}
