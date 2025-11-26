import { useState } from 'react';

function OperacionForm(props) {
  // Valores ingresados por el usuario
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');

  function manejoSuma() {
    props.onSumar(Number(valor1), Number(valor2));
  }
  function manejoResta() {
    props.onRestar(Number(valor1), Number(valor2));
  }
  function manejoMultiplicacion() {
    props.onMultiplicar(Number(valor1), Number(valor2));
  }
  function manejoDivision() {
    props.onDividir(Number(valor1), Number(valor2));
  }

  return (
    <div className="operacion-form">
      <input
        type="number"
        value={valor1}
        onChange={(e) => setValor1(e.target.value)}
        placeholder="Valor 1"
      />
      <input
        type="number"
        value={valor2}
        onChange={(e) => setValor2(e.target.value)}
        placeholder="Valor 2"
      />
      <div className="button-group">
        <button onClick={manejoSuma}>Sumar</button>
        <button onClick={manejoResta}>Restar</button>
        <button onClick={manejoMultiplicacion}>Multiplicar</button>
        <button onClick={manejoDivision}>Dividir</button>
      </div>
    </div>
  );
}
export default OperacionForm;
