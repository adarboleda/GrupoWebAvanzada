import React from 'react';
import Form from './components/Form';
import ListaEmpleados from './components/ListaEmpleados';
import './App.css';

/**
 * Componente principal de la aplicación
 * Ejercicio 2: Reajuste de Sueldos
 * Autor: Esteban Santos
 */
function App() {
  return (
    <div className="App">
      <Form />
      <ListaEmpleados />
    </div>
  );
}

export default App;
