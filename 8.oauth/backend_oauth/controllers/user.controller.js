const UserService = require('../services/user.service.js');

class UserController {
  static getProfile(req, res) {
    //extraer el id del usuario desde el token jwt
    const userId = req.user.sub; // Suponiendo que el middleware de autenticación agrega el usuario al request
    const perfil = UserService.getProfile(userId);
    if (!perfil)
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    res.json({
      ok: true,
      data: perfil,
    });
  }
}

module.exports = UserController;
