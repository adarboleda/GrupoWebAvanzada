import mongoose from 'mongoose';
import crypto from 'crypto';

// Función para generar código único tipo DEUNA (8 caracteres alfanuméricos)
function generarCodigoDeuna() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Función para generar usuario basado en el nombre
function generarUsuario(nombre) {
  // Toma las primeras letras del nombre, quita espacios y lo hace minúscula
  const base = nombre.toLowerCase().replace(/\s+/g, '').substring(0, 8);
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del cliente es requerido'],
      trim: true,
    },
    cedula: {
      type: String,
      required: [true, 'La cédula es requerida'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    // Credenciales de acceso
    usuario: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: 'contraseña1',
    },
    // Código único DEUNA para recibir transferencias (se regenera en cada login)
    codigoDeuna: {
      type: String,
      unique: true,
      default: generarCodigoDeuna,
    },
    // Saldo disponible
    saldo: {
      type: Number,
      default: 0,
      min: [0, 'El saldo no puede ser negativo'],
    },
    // Estado de la cuenta
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generar usuario antes de guardar si no existe
clienteSchema.pre('save', function(next) {
  if (!this.usuario) {
    this.usuario = generarUsuario(this.nombre);
  }
  next();
});

// Método para regenerar código DEUNA
clienteSchema.methods.regenerarCodigo = function() {
  this.codigoDeuna = generarCodigoDeuna();
  return this.save();
};

// Método para verificar contraseña
clienteSchema.methods.verificarPassword = function(password) {
  return this.password === password;
};

export default mongoose.model('Cliente', clienteSchema);
