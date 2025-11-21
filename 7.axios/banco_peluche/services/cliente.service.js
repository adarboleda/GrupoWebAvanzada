import Cliente from '../models/Cliente.js';

class ClienteService {
  calcularDatosCliente(datosCliente) {
    const { saldoAnterior, montoCompras, pagoRealizado } = datosCliente;

    // Paso 2 — Saldo Base
    const saldoBase = saldoAnterior + montoCompras - pagoRealizado;

    // Paso 3 — Pago mínimo base (15%)
    const pagoMinimoBase = 0.15 * saldoBase;

    // Paso 4 — Verificar morosidad
    let esMoroso = pagoRealizado < pagoMinimoBase;

    let interes = 0;
    let multa = 0;

    if (esMoroso) {
      // Paso 5A — Interés
      interes = 0.12 * saldoBase;

      // Paso 6A — Multa
      multa = 200;
    }

    // Paso 7A / 6B — Saldo actual
    const saldoActual = saldoBase + interes + multa;

    // Paso 9 — Pago mínimo
    const pagoMinimo = 0.15 * saldoActual;

    // Paso 10 — Pago sin intereses
    const pagoNoIntereses = 0.85 * saldoActual;

    return {
      saldoBase,
      pagoMinimoBase,
      esMoroso,
      interes,
      multa,
      saldoActual,
      pagoMinimo,
      pagoNoIntereses,
    };
  }

  async crearCliente(datosCliente) {
    const calculos = this.calcularDatosCliente(datosCliente);

    const cliente = new Cliente({
      ...datosCliente,
      ...calculos,
    });

    return await cliente.save();
  }

  async obtenerClientes() {
    return await Cliente.find().sort({ createdAt: -1 });
  }

  async obtenerClientePorId(id) {
    return await Cliente.findById(id);
  }

  async actualizarCliente(id, datosCliente) {
    const calculos = this.calcularDatosCliente(datosCliente);

    return await Cliente.findByIdAndUpdate(
      id,
      { ...datosCliente, ...calculos },
      { new: true, runValidators: true }
    );
  }

  async eliminarCliente(id) {
    return await Cliente.findByIdAndDelete(id);
  }

  async obtenerEstadisticas() {
    const total = await Cliente.countDocuments();
    const morosos = await Cliente.countDocuments({ esMoroso: true });
    const noMorosos = total - morosos;

    return {
      total,
      morosos,
      noMorosos,
    };
  }
}

export default new ClienteService();
