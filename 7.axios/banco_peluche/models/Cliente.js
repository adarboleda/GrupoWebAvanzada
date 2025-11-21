import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del cliente es requerido'],
      trim: true,
    },
    saldoAnterior: {
      type: Number,
      required: [true, 'El saldo anterior es requerido'],
      default: 0,
      min: [0, 'El saldo anterior no puede ser negativo'],
    },
    montoCompras: {
      type: Number,
      required: [true, 'El monto de compras es requerido'],
      default: 0,
      min: [0, 'El monto de compras no puede ser negativo'],
    },
    pagoRealizado: {
      type: Number,
      required: [true, 'El pago realizado es requerido'],
      default: 0,
      min: [0, 'El pago realizado no puede ser negativo'],
    },
    // Campos calculados
    saldoBase: {
      type: Number,
    },
    pagoMinimoBase: {
      type: Number,
    },
    esMoroso: {
      type: Boolean,
      default: false,
    },
    interes: {
      type: Number,
      default: 0,
    },
    multa: {
      type: Number,
      default: 0,
    },
    saldoActual: {
      type: Number,
    },
    pagoMinimo: {
      type: Number,
    },
    pagoNoIntereses: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Cliente', clienteSchema);
