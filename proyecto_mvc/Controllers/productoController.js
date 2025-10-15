import ProductoModel from "../Models/productoModel.js";
import {
  vistaProductos,
  vistaIndividualProducto,
  vistaEditarProducto, // nuevo
} from "../Views/productoView.js";

//controlador: mostrar lista de productos
export const listarProductos = (req, res) => {
  //obtener los datos del modelo
  const productos = ProductoModel.obtenerTodos();
  //generar la vista
  res.type("html").send(vistaProductos(productos));
};

//mostrar producto especifico
export const mostrarProductoIndividual = (req, res) => {
  const { id } = req.params; //obtener el id de la url
  const producto = ProductoModel.obtenerPorId(id); //buscar el producto en el modelo
  //si no lo encuentra, mostrar mensaje de error
  if (!producto) {
    return res.status(404).send("<h1>Producto no encontrado</h1>");
  }
  res.type("html").send(vistaIndividualProducto(producto));
};

//mostrar formulario de edición
export const mostrarFormularioEdicion = (req, res) => {
  const { id } = req.params;
  const producto = ProductoModel.obtenerPorId(id);
  if (!producto) {
    return res.status(404).send("<h1>Producto no encontrado</h1>");
  }
  res.type("html").send(vistaEditarProducto(producto));
};

//controlador: agregar nuevo producto
export const agregarProducto = (req, res) => {
  const { nombre, precio, categoria } = req.body; //datos del formulario
  //validar basicade datos con error 400
  if (!nombre || !precio || !categoria) {
    return res.status(400).send("Faltan datos");
  } else if (isNaN(precio) || precio <= 0) {
    return res.status(400).send("Precio inválido");
  } else if (typeof nombre !== "string" || typeof categoria !== "string") {
    return res.status(400).send("Nombre o categoría inválidos");
  }

  // guardar el producto
  ProductoModel.agregarProducto(nombre, parseFloat(precio), categoria);

  //volver al listado principal
  res.redirect("/productos");
};

//eliminar producto
export const eliminarProducto = (req, res) => {
  const { id } = req.params;
  const eliminado = ProductoModel.eliminarPorId(id); //eliminar el producto
  if (!eliminado) {
    return res.status(404).send("<h1>Producto no encontrado</h1>");
  }
  res.redirect("/productos");
};

//procesar actualización del producto
export const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).send("Faltan datos");
  } else if (isNaN(precio) || precio <= 0) {
    return res.status(400).send("Precio inválido");
  } else if (typeof nombre !== "string" || typeof categoria !== "string") {
    return res.status(400).send("Nombre o categoría inválidos");
  }

  const actualizado = ProductoModel.actualizar(
    id,
    nombre,
    parseFloat(precio),
    categoria
  );
  if (!actualizado) {
    return res.status(404).send("<h1>Producto no encontrado</h1>");
  }

  res.redirect("/productos");
};
