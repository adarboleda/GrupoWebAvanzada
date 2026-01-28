import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalculadoraPoliza from './components/CalculadoraPoliza';
import Clientes from './pages/Clientes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calcular" element={<CalculadoraPoliza />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
