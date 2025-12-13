import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'seguros_vehiculares_secret_key_2025';

export const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No autorizado - Token no proporcionado',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'No autorizado - Token inválido o expirado',
    });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acceso denegado - Se requieren permisos de administrador',
    });
  }
  next();
};
