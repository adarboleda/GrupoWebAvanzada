function Historial(props) {
  return (
    <div className="historial-container">
      <h2>Historial de Operaciones</h2>
      {props.operaciones.length === 0 ? (
        <p className="historial-vacio">No hay operaciones realizadas aún</p>
      ) : (
        <ul className="historial-lista">
          {props.operaciones.map((operacion, index) => (
            <li key={index} className="historial-item">
              <span className="operacion-numero">#{props.operaciones.length - index}</span>
              <span className="operacion-detalle">{operacion}</span>
            </li>
          ))}
        </ul>
      )}
      {props.operaciones.length > 0 && (
        <button className="btn-limpiar" onClick={props.onLimpiar}>
          Limpiar Historial
        </button>
      )}
    </div>
  );
}

export default Historial;
