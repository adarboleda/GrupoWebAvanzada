import { useState, useEffect } from "react";

function ProductForm({ onCrear, productoEditar, onActualizar, onCancelar }) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    // useEffect para cargar los datos del producto a editar
    useEffect(() => {
        if (productoEditar) {
            setTitle(productoEditar.title);
            setPrice(productoEditar.price.toString());
        } else {
            setTitle("");
            setPrice("");
        }
    }, [productoEditar]);

    function manejarSubmit(e) {
        e.preventDefault();

        if (title.trim() === "" || price.trim() === "") return;

        const producto = {
            title,
            price: Number(price)
        };

        // Si estamos editando, llamar a onActualizar, sino a onCrear
        if (productoEditar) {
            onActualizar(productoEditar.id, producto);
        } else {
            onCrear(producto);
        }

        // Limpiar el formulario
        setTitle("");
        setPrice("");
    }

    function handleCancelar() {
        setTitle("");
        setPrice("");
        onCancelar();
    }

    return (
        <form onSubmit={manejarSubmit} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
            <h2>
                {productoEditar ? (
                    <>
                        Editar Producto{" "}
                        <span style={{
                            backgroundColor: "#e0e0e0",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            fontSize: "14px"
                        }}>
                            ID: {productoEditar.id}
                        </span>
                    </>
                ) : (
                    "Crear Producto"
                )}
            </h2>
            <div>
                <input
                    type="text"
                    placeholder="Título del producto"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px", width: "200px" }}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ marginRight: "10px", padding: "8px", width: "100px" }}
                />
                <button type="submit" style={{
                    padding: "8px 15px",
                    backgroundColor: productoEditar ? "#4CAF50" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginRight: "5px"
                }}>
                    {productoEditar ? "Actualizar" : "Crear"}
                </button>
                {productoEditar && (
                    <button
                        type="button"
                        onClick={handleCancelar}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: "#9E9E9E",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer"
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProductForm;
