function Resultado(props) {
  return (
    <div className="resultado-container">
      <h2>Resultado</h2>
      <p>{props.valor || 'Esperando operación...'}</p>
    </div>
  );
}

export default Resultado;
