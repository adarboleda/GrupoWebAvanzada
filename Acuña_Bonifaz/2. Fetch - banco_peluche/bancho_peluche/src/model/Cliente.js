import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    saldoAnterior: { type: Number, required: true },
    montoCompras: { type: Number, required: true },
    pagoRealizado: { type: Number, required: true },
    saldoBase: { type: Number },
    pagoMinimoBase: { type: Number },
    esMoroso: { type: Boolean, default: false },
    interes: { type: Number, default: 0 },
    multa: { type: Number, default: 0 },
    saldoActual: { type: Number },
    pagoMinimo: { type: Number },
    pagoNoIntereses: { type: Number }
}, { timestamps: true });

export const Cliente = model("Cliente", clienteSchema);
