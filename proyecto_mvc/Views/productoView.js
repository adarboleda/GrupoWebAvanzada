//crear un html para listrar los productos
export function vistaProductos(productos) {
  //cabecera
  let html = `
    <h1>Lista de Productos</h1>
    <a href="/productos/nuevo">Agregar Nuevo Producto</a>
    <ul>`;

  //recorrer los productos
  productos.forEach((p) => {
    html += `
        <li>
        <a href="/productos/${p.id}">${p.nombre}</a> - $${p.precio} - ${p.categoria}
        </li>
        `;
  });

  //cierre de la lista
  html += `</ul>`;
  return html;
}

//Generar html del detalle del producto
export function vistaDetalleProducto(producto) {
  if (!producto) {
    return `<h1>Producto no encontrado</h1><a href="/productos">Volver a la lista</a>`;
  }

  return `
    <h1>Detalle del Producto</h1>
    <p><strong>Nombre:</strong> ${producto.nombre}</p>
    <p><strong>Precio:</strong> $${producto.precio}</p>
    <p><strong>Categoría:</strong> ${producto.categoria}</p>
    <a href="/productos">Volver a la lista</a>
    `;
}
