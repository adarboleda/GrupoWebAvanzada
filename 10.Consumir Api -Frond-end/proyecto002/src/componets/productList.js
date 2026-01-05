function ProductList({ productos, onEliminar, onEditar }) {
    return (
        <div>
            <h2>Lista de Productos</h2>
            {productos.length === 0 ? (
                <p>No hay productos</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {productos.map(producto => (
                        <li key={producto.id} style={{
                            marginBottom: "10px",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "5px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <span style={{
                                        backgroundColor: "#e0e0e0",
                                        padding: "2px 8px",
                                        borderRadius: "3px",
                                        marginRight: "10px",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}>
                                        ID: {producto.id}
                                    </span>
                                    <strong>{producto.title}</strong> - ${producto.price}
                                </div>
                                <div>
                                    <button
                                        onClick={() => onEditar(producto)}
                                        style={{
                                            marginRight: "5px",
                                            padding: "5px 10px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onEliminar(producto.id)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#f44336",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default ProductList;