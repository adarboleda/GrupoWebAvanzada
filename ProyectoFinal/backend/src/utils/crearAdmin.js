import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Script para crear un usuario administrador por defecto
 * Ejecutar: node src/utils/crearAdmin.js
 */
const crearAdmin = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExiste = await Usuario.findOne({ email: 'admin@logistica.com' });

    if (adminExiste) {
      console.log('⚠️  El usuario admin ya existe');
      console.log('Email:', adminExiste.email);
      console.log('Rol:', adminExiste.rol);
      await mongoose.connection.close();
      return;
    }

    // Crear usuario admin
    const admin = await Usuario.create({
      nombre: 'Administrador Principal',
      email: 'admin@logistica.com',
      password: 'admin123', // Se hasheará automáticamente
      rol: 'admin',
      telefono: '3001234567',
    });

    console.log('\n✅ Usuario admin creado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Rol:', admin.rol);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(
      '\n⚠️  IMPORTANTE: Cambie la contraseña después del primer inicio de sesión',
    );

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Ejecutar
crearAdmin();
