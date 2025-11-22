const AuthService = require('../services/auth.service.js');

class AuthController {
  static login(req, res) {
    const { username, password } = req.body;

    const result = AuthService.login(username, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrecta',
      });
    }
    res.json({
      ok: true,
      token: result.token,
      user: result.user,
    });
  }
}

module.exports = AuthController;
