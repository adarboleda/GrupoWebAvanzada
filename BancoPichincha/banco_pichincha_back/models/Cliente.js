import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import crypto from 'crypto';

// Función para generar código único tipo DEUNA (8 caracteres alfanuméricos)
function generarCodigoDeuna() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Función para validar cédula ecuatoriana
function validarCedulaEcuatoriana(cedula) {
  // Verificar que tenga 10 dígitos
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{10}$/.test(cedula)) {
    return false;
  }

  // Obtener código de provincia (primeros 2 dígitos)
  const provincia = parseInt(cedula.substring(0, 2), 10);

  // Verificar que la provincia sea válida (01-24 o 30 para extranjeros)
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
    return false;
  }

  // Obtener tercer dígito (tipo de cédula: 0-5 para personas naturales)
  const tercerDigito = parseInt(cedula.charAt(2), 10);
  if (tercerDigito > 5) {
    return false;
  }

  // Algoritmo de validación del dígito verificador (módulo 10)
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const digitoVerificadorCalculado = (10 - (suma % 10)) % 10;
  const digitoVerificador = parseInt(cedula.charAt(9), 10);

  return digitoVerificadorCalculado === digitoVerificador;
}

// Crear clase Cliente
class Cliente extends Model {
  // Método para regenerar código DEUNA
  async regenerarCodigo() {
    this.codigoDeuna = generarCodigoDeuna();
    await this.save();
    return this;
  }

  // Método para verificar contraseña
  verificarPassword(password) {
    return this.password === password;
  }
}

// Definir el modelo Cliente
Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del cliente es requerido',
        },
      },
    },
    cedula: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: {
        msg: 'La cédula ya está registrada',
      },
      validate: {
        isValidCedula(value) {
          if (!validarCedulaEcuatoriana(value)) {
            throw new Error('La cédula ecuatoriana no es válida');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'El email ya está registrado',
      },
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido',
        },
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Credenciales de acceso
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'El usuario ya existe, elige otro',
      },
      validate: {
        len: {
          args: [4, 50],
          msg: 'El usuario debe tener al menos 4 caracteres',
        },
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'La contraseña debe tener al menos 6 caracteres',
        },
      },
    },
    // Código único DEUNA para recibir transferencias
    codigoDeuna: {
      type: DataTypes.STRING(8),
      unique: true,
      defaultValue: () => generarCodigoDeuna(),
    },
    // Estado de la cuenta
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true, // createdAt y updatedAt
  },
);

export default Cliente;
