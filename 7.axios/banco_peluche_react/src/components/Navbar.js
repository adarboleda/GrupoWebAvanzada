import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">BANCO BANDIDO DE PELUCHE</span>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Mis productos
            </Link>
          </li>
          <li>
            <Link
              to="/estadisticas"
              className={location.pathname === '/estadisticas' ? 'active' : ''}
            >
              Estadísticas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
