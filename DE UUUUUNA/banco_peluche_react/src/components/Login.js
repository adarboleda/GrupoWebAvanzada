import React, { useState } from 'react';
import clienteService from '../services/clienteService';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Campos de login
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos de registro
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await clienteService.login(usuario, password);
      if (response.ok) {
        alert(response.msg);
        onLogin(response.data);
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await clienteService.registro({
        nombre,
        cedula,
        email,
        telefono,
      });
      if (response.ok) {
        alert(response.msg);
        // Cambiar a login después de registrarse
        setIsLogin(true);
        setUsuario(response.data.usuario);
        setPassword('contraseña1');
      }
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">d!</span>
          <h1>Deuna</h1>
          <p>Billetera Digital</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegistro} className="login-form">
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="form-group">
              <label>Cédula *</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: 1712345678"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: juan@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 0991234567"
              />
            </div>
            <button type="submit" className="btn-login btn-registro" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
            <p className="info-password">
              📌 Tu contraseña será: <strong>contraseña1</strong>
            </p>
          </form>
        )}

        <div className="login-footer">
          <p>💡 Abre múltiples ventanas del navegador para simular diferentes usuarios</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
