import DescuentoModel from "../Models/descuentoModel.js";
import { vistaFormulario, vistaResultado } from "../Views/descuentoView.js";

// descuento
export function mostrarFormulario(req, res) {
	res.type("html").send(vistaFormulario());
}

// calcular
export function calcularDescuento(req, res) {
	const { total, numero } = req.body || {};

	// Require numero (no aleatorio)
	if (numero === undefined || numero === null || String(numero).trim() === "") {
		return res.status(400).type("html")
			.send(`<h1>El número es requerido</h1><a href="/descuento"> <-Volver</a>`);
	}

	// VALIDACIÓN ADICIONAL: numero debe ser numérico y mayor que 0
	const n = Number(numero);
	if (!isFinite(n) || n <= 0) {
		return res.status(400).type("html")
			.send(`<h1>El número debe ser un valor numérico mayor que 0</h1><a href="/descuento"> <-Volver</a>`);
	}

	const resultado = DescuentoModel.calcularDescuento(total, n);
	if (!resultado) {
		return res.status(400).type("html")
			.send(`<h1>Datos inválidos. Asegúrese de enviar un total numérico > 0 y un número válido.</h1><a href="/descuento"> <-Volver</a>`);
	}

	return res.type("html").send(vistaResultado(resultado));
}