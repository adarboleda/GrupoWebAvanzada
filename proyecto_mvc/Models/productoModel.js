//clase productos
class Producto {
  constructor(id, nombre, precio, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
  }
}

//Clase que me permite administrar los productos
class ProductoModel {
  static productos = [
    new Producto(1, "Zapatilla", 100, "Deporte"),
    new Producto(2, "Camiseta", 50, "Deporte"),
    new Producto(3, "Pantalón", 80, "Deporte"),
    new Producto(4, "Chaqueta", 120, "Invierno"),
    new Producto(5, "Bufanda", 30, "Invierno"),
    new Producto(6, "Guantes", 25, "Invierno"),
  ];

  //metodo para obtener todos los productos
  static obtenerTodos() {
    return this.productos;
  }

  //buscar un producto por id
  static obtenerPorId(id) {
    return this.productos.find((p) => p.id === parseInt(id));
  }

  //agregar un producto
  static agregarProducto(nombre, precio, categoria) {
    const nuevoProducto = new Producto(
      this.productos.length + 1, //genera el id de forma automatica
      nombre,
      precio,
      categoria
    );
    this.productos.push(nuevoProducto);
    return nuevoProducto; //devolver el producto agregado
  }
}

//Exportar la clase para que el controlador pueda usarla

export default ProductoModel;
