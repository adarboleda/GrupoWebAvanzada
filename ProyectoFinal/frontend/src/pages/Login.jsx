import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { authService } from '../services';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );

      if (response.success) {
        // Guardar token y usuario en el store
        login(response.data.usuario, response.data.token);

        // Redirigir al dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);

      // Manejo de errores mejorado
      if (err.response) {
        // Error de respuesta del servidor
        setError(err.response.data?.message || 'Credenciales incorrectas');
      } else if (err.request) {
        // Error de red
        setError('No se pudo conectar con el servidor. Verifique su conexión.');
      } else {
        // Otro tipo de error
        setError('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Card className="w-full md:w-30rem shadow-5">
        {/* Header del Card */}
        <div className="text-center mb-4">
          <i className="pi pi-box text-6xl text-primary mb-3"></i>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Plataforma Logística
          </h1>
          <p className="text-500">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
          {/* Mensaje de error */}
          {error && (
            <Message
              severity="error"
              text={error}
              className="w-full"
              icon="pi pi-times-circle"
            />
          )}

          {/* Campo Email */}
          <div className="flex flex-column gap-2">
            <label htmlFor="email" className="font-semibold">
              <i className="pi pi-envelope mr-2"></i>
              Correo Electrónico
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              className={classNames({ 'p-invalid': error })}
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          {/* Campo Password */}
          <div className="flex flex-column gap-2">
            <label htmlFor="password" className="font-semibold">
              <i className="pi pi-lock mr-2"></i>
              Contraseña
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              className={classNames('w-full', { 'p-invalid': error })}
              inputClassName="w-full"
              feedback={false}
              toggleMask
              required
              autoComplete="current-password"
            />
          </div>

          {/* Botón de login */}
          <Button
            type="submit"
            label={loading ? 'Ingresando...' : 'Iniciar Sesión'}
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full mt-2"
            size="large"
          />

          {/* Divider */}
          <Divider align="center">
            <span className="text-sm text-500">
              o usa credenciales de prueba
            </span>
          </Divider>

          {/* Toggle para mostrar credenciales */}
          <Button
            type="button"
            label={
              showCredentials
                ? 'Ocultar credenciales'
                : 'Ver credenciales de prueba'
            }
            icon={showCredentials ? 'pi pi-eye-slash' : 'pi pi-eye'}
            onClick={() => setShowCredentials(!showCredentials)}
            className="p-button-text p-button-sm"
          />

          {/* Credenciales de prueba */}
          {showCredentials && (
            <div className="surface-100 p-3 border-round">
              <div className="flex flex-column gap-2">
                <div className="flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-sm">Admin</strong>
                    <p className="text-xs text-500 mt-1 mb-0">
                      admin@logistica.com / admin123
                    </p>
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-arrow-right"
                    className="p-button-rounded p-button-sm"
                    onClick={() =>
                      fillCredentials('admin@logistica.com', 'admin123')
                    }
                    tooltip="Usar estas credenciales"
                  />
                </div>

                <Divider className="my-2" />

                <div className="flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-sm">Operador</strong>
                    <p className="text-xs text-500 mt-1 mb-0">
                      operador@logistica.com / operador123
                    </p>
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-arrow-right"
                    className="p-button-rounded p-button-sm"
                    onClick={() =>
                      fillCredentials('operador@logistica.com', 'operador123')
                    }
                    tooltip="Usar estas credenciales"
                  />
                </div>

                <Divider className="my-2" />

                <div className="flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-sm">Coordinador</strong>
                    <p className="text-xs text-500 mt-1 mb-0">
                      coordinador@logistica.com / coordinador123
                    </p>
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-arrow-right"
                    className="p-button-rounded p-button-sm"
                    onClick={() =>
                      fillCredentials(
                        'coordinador@logistica.com',
                        'coordinador123',
                      )
                    }
                    tooltip="Usar estas credenciales"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-4 pt-3 border-top-1 surface-border">
          <p className="text-xs text-500">
            <i className="pi pi-info-circle mr-1"></i>
            Asegúrate de que el backend esté ejecutándose en el puerto 5000
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;
