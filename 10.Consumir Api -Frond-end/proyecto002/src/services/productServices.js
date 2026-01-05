// Servicio api
const BASE_URL = 'https://dummyjson.com/products';

// GET - Obtener todos los productos
export async function obtenerProductos() {
    const resp = await fetch(BASE_URL);
    const data = await resp.json();
    return data.products;
}

// POST - Crear un nuevo producto
export async function crearProducto(producto) {
    const resp = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
    });
    return await resp.json();
}

// PUT - Actualizar un producto existente
export async function actualizarProducto(id, producto) {
    const resp = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
    });
    return await resp.json();
}

// DELETE - Eliminar un producto
export async function eliminarProducto(id) {
    const resp = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return await resp.json();
}