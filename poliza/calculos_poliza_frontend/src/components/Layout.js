import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">📋</span>
            PolizApp
          </h1>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/calcular" 
              className={`nav-link ${isActive('/calcular') ? 'active' : ''}`}
            >
              <span className="nav-icon">🧮</span>
              <span className="nav-text">Calcular</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/clientes" 
              className={`nav-link ${isActive('/clientes') ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Clientes</span>
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">MA</div>
            <div className="user-details">
              <p className="user-name">Marcelo Acuña</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        <header className="top-bar">
          <div className="top-bar-content">
            <h2 className="page-title">
              {location.pathname === '/' && '📊 Dashboard'}
              {location.pathname === '/calcular' && '🧮 Calcular Póliza'}
              {location.pathname === '/clientes' && '👥 Gestión de Clientes'}
            </h2>
            <div className="header-right">
              <span className="date">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </header>

        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
