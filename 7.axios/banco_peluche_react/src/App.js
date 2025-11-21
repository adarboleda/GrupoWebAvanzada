import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientesList from './components/ClientesList';
import ClienteDetalle from './components/ClienteDetalle';
import Estadisticas from './components/Estadisticas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ClientesList />} />
            <Route path="/cliente/:id" element={<ClienteDetalle />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
