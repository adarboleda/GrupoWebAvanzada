import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [cliente, setCliente] = useState(null);

  // Verificar si hay un cliente guardado en sessionStorage
  useEffect(() => {
    const clienteGuardado = sessionStorage.getItem('cliente');
    if (clienteGuardado) {
      setCliente(JSON.parse(clienteGuardado));
    }
  }, []);

  // Manejar login exitoso
  const handleLogin = (clienteData) => {
    setCliente(clienteData);
    sessionStorage.setItem('cliente', JSON.stringify(clienteData));
  };

  // Manejar logout
  const handleLogout = () => {
    setCliente(null);
    sessionStorage.removeItem('cliente');
  };

  return (
    <div className="App">
      {cliente ? (
        <Dashboard cliente={cliente} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
