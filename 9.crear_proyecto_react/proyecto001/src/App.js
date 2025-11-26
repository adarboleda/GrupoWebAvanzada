import './App.css';
import { useState } from 'react';
import OperacionForm from './components/OperacionForm';
import Resultado from './components/Resultado';
import Historial from './components/Historial';
import { sumar, restar, multiplicar, dividir } from './services/operaciones';

function App() {
  const [resultado, setResultado] = useState('');
  const [historial, setHistorial] = useState([]);
  function manejarSuma(v1, v2) {
    const res = sumar(v1, v2);
    const mensaje = `${v1} + ${v2} = ${res}`;
    setResultado('La suma es: ' + res);
    setHistorial([mensaje, ...historial]);
  }

  function manejarResta(v1, v2) {
    const res = restar(v1, v2);
    const mensaje = `${v1} - ${v2} = ${res}`;
    setResultado('La resta es: ' + res);
    setHistorial([mensaje, ...historial]);
  }

  function manejarMultiplicacion(v1, v2) {
    const res = multiplicar(v1, v2);
    const mensaje = `${v1} × ${v2} = ${res}`;
    setResultado('La multiplicación es: ' + res);
    setHistorial([mensaje, ...historial]);
  }

  function manejarDivision(v1, v2) {
    try {
      const res = dividir(v1, v2);
      const mensaje = `${v1} ÷ ${v2} = ${res}`;
      setResultado('La división es: ' + res);
      setHistorial([mensaje, ...historial]);
    } catch (error) {
      setResultado(error.message);
      setHistorial([`Error: ${v1} ÷ ${v2} (${error.message})`, ...historial]);
    }
  }

  function limpiarHistorial() {
    setHistorial([]);
  }
  return (
    <div className="App">
      <h1>Calculadora de Operaciones Básicas</h1>
      <OperacionForm
        onSumar={manejarSuma}
        onRestar={manejarResta}
        onMultiplicar={manejarMultiplicacion}
        onDividir={manejarDivision}
      />
      <Resultado valor={resultado} />
      <Historial operaciones={historial} onLimpiar={limpiarHistorial} />
    </div>
  );
}

export default App;
