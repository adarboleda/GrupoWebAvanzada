import mongoose from 'mongoose';

//crear la estructura del documento
const compradorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    edad: { type: Number, required: true },
  },
  {
    collection: 'compradores',
  }
);

//exportar el modelo
export default mongoose.model('Comprador', compradorSchema);
