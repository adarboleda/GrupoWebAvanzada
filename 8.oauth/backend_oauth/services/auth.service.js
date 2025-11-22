const jwt = require('jsonwebtoken');
const { users } = require('../models/user.model.js');
const { jwtSecret, jwtExpiration } = require('../config/jwt.config.js');

class AuthService {
  static login(username, password) {
    const user = users.find((u) => u.username === username && u.password === password);
    //si no encuentra el usuario
    if (!user) return null;

    // 2. Crear token JWT
    const payload = {
      sub: user.id,
      username: user.username,
    };
    //3. Firmar el token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nombreCompleto: user.nombreCompleto,
        email: user.email,
      },
    };
  }
}

module.exports = AuthService;
