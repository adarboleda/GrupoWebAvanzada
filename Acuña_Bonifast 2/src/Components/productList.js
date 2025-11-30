function ProductList({ products = [], onEditar, onEliminar, onBuscar }) {
    return (
        <div>
            <h2>Listar Productos</h2>
            <input 
                type="text" 
                placeholder="Buscar producto..."
                onChange={(e) => onBuscar(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                }}
            />
            {products.length === 0 && <p>No hay productos disponibles.</p>}
            <ul>
                {products.map(product => (
                    <li key={product.id}> 
                        <span>{product.title}</span>
                        <span className="price">${product.price}</span>
                        <div className="button-container">
                            <button onClick={() => onEditar(product)}>Editar</button>
                            <button onClick={() => onEliminar(product.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;