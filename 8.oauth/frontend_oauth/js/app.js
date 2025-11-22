// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Referencias a elementos del DOM
const loginScreen = document.getElementById('login-screen');
const profileScreen = document.getElementById('profile-screen');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loading = document.getElementById('loading');
const profileContent = document.getElementById('profile-content');

// Verificar si hay un token guardado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    loadProfile(token);
  }
});

// Manejar el envío del formulario de login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Deshabilitar botón y mostrar loading
  loginBtn.disabled = true;
  loginBtn.textContent = 'Iniciando sesión...';
  errorMessage.style.display = 'none';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Mostrar mensaje de éxito
      showSuccess('¡Login exitoso!');

      // Cargar perfil
      setTimeout(() => {
        loadProfile(data.token);
      }, 500);
    } else {
      // Mostrar error
      showError(data.message || 'Usuario o contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error en login:', error);
    showError('Error de conexión. Asegúrate de que el servidor esté ejecutándose.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Iniciar Sesión';
  }
});

// Cargar perfil del usuario
async function loadProfile(token) {
  // Cambiar a pantalla de perfil
  loginScreen.classList.remove('active');
  profileScreen.classList.add('active');

  // Mostrar loading
  loading.style.display = 'block';
  profileContent.style.display = 'none';

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      // Mostrar datos del perfil
      document.getElementById('user-id').textContent = data.data.id;
      document.getElementById('user-username').textContent = data.data.username;
      document.getElementById('user-nombre').textContent = data.data.nombreCompleto;
      document.getElementById('user-email').textContent = data.data.email;
      document.getElementById('token-display').textContent = token;

      // Ocultar loading y mostrar contenido
      loading.style.display = 'none';
      profileContent.style.display = 'block';
    } else {
      throw new Error('Token inválido');
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    showError('Error al cargar el perfil. Token inválido o expirado.');
    logout();
  }
}

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
  logout();
});

function logout() {
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Limpiar formulario
  loginForm.reset();

  // Volver a pantalla de login
  profileScreen.classList.remove('active');
  loginScreen.classList.add('active');

  // Limpiar mensajes
  errorMessage.style.display = 'none';
}

// Mostrar mensaje de error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.className = 'error-message';
}

// Mostrar mensaje de éxito
function showSuccess(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.className = 'success-message';
}
