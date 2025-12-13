import bcrypt from 'bcryptjs';
import { Usuario } from '../models/usuario.js';
import { sequelize } from '../config/database.js';

async function crearUsuarioAdmin() {
  try {
    await sequelize.sync();

    // Verificar si ya existe un usuario admin
    const adminExistente = await Usuario.findOne({
      where: { username: 'admin' },
    });

    if (adminExistente) {
      console.log('El usuario admin ya existe');
      return;
    }

    // Crear usuario admin
    const admin = await Usuario.create({
      username: 'admin',
      password: 'admin123', // Se hasheará automáticamente con el hook
      nombre_completo: 'Administrador del Sistema',
      email: 'admin@seguros.com',
      rol: 'ADMIN',
      activo: true,
    });

    console.log('Usuario admin creado exitosamente:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Rol: ADMIN');
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  } finally {
    await sequelize.close();
  }
}

crearUsuarioAdmin();
