import { Usuario } from '../models/usuario.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'seguros_vehiculares_secret_key_2025';
const JWT_EXPIRES_IN = '24h';

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username y password son requeridos',
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({
      where: { username, activo: true },
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: error.message,
    });
  }
};

// Verificar token
export const verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Token no proporcionado',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id_usuario, {
      attributes: [
        'id_usuario',
        'username',
        'nombre_completo',
        'email',
        'rol',
        'activo',
      ],
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        error: 'Usuario no válido',
      });
    }

    res.status(200).json({
      valido: true,
      usuario: usuario.toJSON(),
    });
  } catch (error) {
    res.status(401).json({
      valido: false,
      error: 'Token inválido o expirado',
    });
  }
};

// Crear usuario (solo para admin o setup inicial)
export const crearUsuario = async (req, res) => {
  try {
    const { username, password, nombre_completo, email, rol } = req.body;

    const usuarioExiste = await Usuario.findOne({
      where: { username },
    });

    if (usuarioExiste) {
      return res.status(400).json({
        error: 'El username ya está en uso',
      });
    }

    const emailExiste = await Usuario.findOne({
      where: { email },
    });

    if (emailExiste) {
      return res.status(400).json({
        error: 'El email ya está en uso',
      });
    }

    const nuevoUsuario = await Usuario.create({
      username,
      password,
      nombre_completo,
      email,
      rol: rol || 'OPERADOR',
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        username: nuevoUsuario.username,
        nombre_completo: nuevoUsuario.nombre_completo,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      error: 'Error al crear usuario',
      detalle: error.message,
    });
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id_usuario, {
      attributes: ['id_usuario', 'username', 'nombre_completo', 'email', 'rol'],
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error al obtener perfil',
      detalle: error.message,
    });
  }
};

// Listar todos los usuarios (solo para admin)
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: [
        'id_usuario',
        'username',
        'nombre_completo',
        'email',
        'rol',
        'activo',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({
      error: 'Error al listar usuarios',
      detalle: error.message,
    });
  }
};

// Obtener usuario por ID (solo para admin)
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: [
        'id_usuario',
        'username',
        'nombre_completo',
        'email',
        'rol',
        'activo',
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error al obtener usuario',
      detalle: error.message,
    });
  }
};

// Actualizar usuario (solo para admin)
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, nombre_completo, email, rol, activo, password } =
      req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    // Verificar si el username ya existe (excepto el usuario actual)
    if (username && username !== usuario.username) {
      const usernameExiste = await Usuario.findOne({
        where: { username },
      });
      if (usernameExiste) {
        return res.status(400).json({
          error: 'El username ya está en uso',
        });
      }
    }

    // Verificar si el email ya existe (excepto el usuario actual)
    if (email && email !== usuario.email) {
      const emailExiste = await Usuario.findOne({
        where: { email },
      });
      if (emailExiste) {
        return res.status(400).json({
          error: 'El email ya está en uso',
        });
      }
    }

    // Actualizar campos
    if (username) usuario.username = username;
    if (nombre_completo) usuario.nombre_completo = nombre_completo;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;
    if (activo !== undefined) usuario.activo = activo;
    if (password) usuario.password = password; // Se hasheará automáticamente

    await usuario.save();

    res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
      },
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error al actualizar usuario',
      detalle: error.message,
    });
  }
};

// Eliminar usuario (solo para admin)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar al usuario actual
    if (parseInt(id) === req.usuario.id_usuario) {
      return res.status(400).json({
        error: 'No puedes eliminar tu propia cuenta',
      });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    await usuario.destroy();

    res.status(200).json({
      mensaje: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      error: 'Error al eliminar usuario',
      detalle: error.message,
    });
  }
};
