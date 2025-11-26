import mongoose from 'mongoose';

// Conectar a MongoDB
await mongoose.connect('mongodb://localhost:27017/BancoBandidoPeluche');
console.log('✅ Conectado a MongoDB');

// Definir esquema
const clienteSchema = new mongoose.Schema({
    nombre: String,
    saldoAnterior: Number,
    montoCompras: Number,
    pagoRealizado: Number,
    saldoBase: Number,
    pagoMinimoBase: Number,
    esMoroso: Boolean,
    interes: Number,
    multa: Number,
    saldoActual: Number,
    pagoMinimo: Number,
    pagoNoIntereses: Number
}, { timestamps: true });

const Cliente = mongoose.model('Cliente', clienteSchema);

// Crear un cliente de prueba
const nuevoCliente = await Cliente.create({
    nombre: 'Test Desde Script',
    saldoAnterior: 1000,
    montoCompras: 500,
    pagoRealizado: 100,
    saldoBase: 1400,
    pagoMinimoBase: 210,
    esMoroso: true,
    interes: 168,
    multa: 200,
    saldoActual: 1768,
    pagoMinimo: 265.2,
    pagoNoIntereses: 1502.8
});

console.log('✅ Cliente creado:');
console.log(nuevoCliente);

// Verificar que se guardó
const clientes = await Cliente.find();
console.log(`\n✅ Total de clientes en DB: ${clientes.length}`);
console.log('Clientes:');
clientes.forEach(c => console.log(`  - ${c.nombre}`));

await mongoose.disconnect();
console.log('\n✅ Desconectado de MongoDB');
