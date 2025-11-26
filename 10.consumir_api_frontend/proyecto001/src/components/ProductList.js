import './ProductList.css';

function ProductList({ productos, onEliminar, onEditar }) {
  return (
    <div className="list-container">
      <h2>Lista de Productos</h2>
      {productos.length === 0 ? (
        <p className="empty-message">No hay productos disponibles.</p>
      ) : (
        <ul className="product-list">
          {productos.map((producto) => (
            <li key={producto.id} className="product-item">
              <div className="product-info">
                <span className="product-name">{producto.title}</span>
                <span className="product-price">${producto.price}</span>
              </div>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => onEditar(producto)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => onEliminar(producto.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default ProductList;
