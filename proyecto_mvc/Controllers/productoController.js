import ProductoModel from "../Models/productoModel";
import { vistaProductos, vistaDetalleProducto } from "../Views/productoView";

//Controlador para mostrar lista de productos
export function listarProductos(req, res) {
  const productos = ProductoModel.obtenerTodos();
  //generar vista
  res.type("html").send(vistaProductos(productos));
}

//Controlador para mostrar detalle de un producto
export function mostrarDetalleProducto(req, res) {
  const { id } = req.params; //obtener id de la url
  const producto = ProductoModel.obtenerPorId(id); //buscar producto por id
  if (!producto) {
    res.status(404).send("Producto no encontrado");
    return;
  }
  //generar vista
  res.type("html").send(vistaDetalleProducto(producto));
}

//Controlador para agregar un nuevo producto
export function agregarProducto(req, res) {
  const { nombre, precio, categoria } = req.body; //obtener datos del formulario
  //validacion basica de datos
  if (!nombre || !precio || !categoria) {
    res.status(400).send("Faltan datos del producto");
    return;
  }
  //guardar el producto
  const nuevoProducto = ProductoModel.agregarProducto(
    nombre,
    parseFloat(precio),
    categoria
  );
  //redireccionar a la lista de productos
  res.redirect("/productos");
}
