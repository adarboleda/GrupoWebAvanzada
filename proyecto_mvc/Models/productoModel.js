//Clase productos
class Producto {
  constructor(id, nombre, precio, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
  }
}

//clase que me permite administrar los productos
class ProductoModel {
  static Productos = [
    new Producto(1, "Zapatos", 25, "Calzado"),
    new Producto(2, "Zapatillas", 15, "Caballero"),
    new Producto(3, "Balerinas", 30, "Dama"),
    new Producto(4, "Botas", 10, "Dama"),
  ];

  //metodo para obtener todos los productos
  static obtenerTodos() {
    return this.Productos;
  }

  //buscar por su id
  static obtenerPorId(id) {
    return this.Productos.find((p) => p.id === parseInt(id));
  }

  //agregar producto
  static agregarProducto(nombre, precio, categoria) {
    const nuevo = new Producto(
      this.Productos.length + 1, //genear id automatico
      nombre,
      precio,
      categoria
    );
    this.Productos.push(nuevo);
    return nuevo; //devolver el producto agregado
  }
  //eliminar producto
  static eliminarPorId(id) {
    const idNumero = parseInt(id);
    const producto = this.Productos.find((p) => p.id === idNumero);
    if (!producto) {
      return false; //producto no encontrado
    }
    this.Productos = this.Productos.filter((p) => p.id !== idNumero);
    return true; //producto eliminado
  }
  // actualizar producto por id
  static actualizar(id, nombre, precio, categoria) {
    const idNumero = parseInt(id);
    const producto = this.Productos.find((p) => p.id === idNumero);
    if (!producto) {
      return null; // no encontrado
    }
    producto.nombre = nombre;
    producto.precio = precio;
    producto.categoria = categoria;
    return producto; // devolver producto actualizado
  }
}
//exportar la clase para que el controlador pueda usarla
export default ProductoModel;
