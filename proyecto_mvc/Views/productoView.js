//crear html para listar los productos
export function vistaProductos(productos) {
  //cabecera
  let html = `
    <h1>Listado de Productos</h1>
    <a href="/nuevo">Agregar Producto</a>
    <ul>
  
    `;

  //recorrer los productos
  productos.forEach((p) => {
    html += `<li>
        <a href="/productos/${p.id}">${p.nombre} </a>
        - $${p.precio} - ${p.categoria}
        </li>`;
  });

  //cierre de lista
  html += `</ul>`;
  return html;
}

//genrear html del detalle del producto
export function vistaIndividualProducto(producto) {
  if (!producto) {
    return `<h1>El producto no se encontró</h1>
        <a href="/"> <-Volver</a>`;
  }

  return `
    <h1>Detalle del Producto</h1>
    <p><b>ID: </b>${producto.id}</p>
    <p><b>Nombre: </b>${producto.nombre}</p>
    <p><b>Precio: </b>$${producto.precio}</p>
    <p><b>Categoria: </b>${producto.categoria}</p>
    <a href="/productos/${producto.id}/editar">Editar</a><br><br>
    <form style="display:inline" method="POST" action="/productos/${producto.id}/eliminar">
            <button type="submit" onclick="return confirm('Eliminar este producto?')">Eliminar</button>
          </form><br>
    <br><a href="/productos"> <-Volver</a>
    
    `;
}

// Forrmulario de edición
export function vistaEditarProducto(producto) {
  if (!producto) {
    return `<h1>Producto no encontrado</h1><a href="/productos">Volver</a>`;
  }
  return `
    <h1>Editar Producto</h1>
    <form method="POST" action="/productos/${producto.id}/editar">
      <label>Nombre: <input type="text" name="nombre" value="${producto.nombre}" required></label><br>
      <label>Precio: <input type="number" step="0.01" name="precio" value="${producto.precio}" required></label><br>
      <label>Categoría: <input type="text" name="categoria" value="${producto.categoria}" required></label><br>
      <button type="submit">Guardar cambios</button>
    </form>
    <a href="/productos">Volver a la lista</a>
    `;
}
