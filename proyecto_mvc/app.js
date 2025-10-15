import express from "express";
import {
  listarProductos,
  mostrarProductoIndividual,
  agregarProducto,
  eliminarProducto,
  mostrarFormularioEdicion, // nuevo
  actualizarProducto, // nuevo
} from "./Controllers/productoController.js";

//inicializar express

const app = express();
const PORT = 3000;

//middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));

//rutas
app.get("/", (req, res) => res.redirect("/productos")); //redireccionar a /productos
app.get("/productos", listarProductos); //listar productos

//rutas específicas (deben ir antes de /productos/:id)
app.get("/nuevo", (req, res) => {
  //formulario para agregar nuevo producto
  res.send(`
    <h1>Agregar Nuevo Producto</h1>
    <form method="POST" action="/productos">
    <label>Nombre: <input type="text" name="nombre" required></label><br>
    <label>Precio: <input type="number" step="0.01" name="precio" required></label><br>
    <label>Categoría: <input type="text" name="categoria" required></label><br>
      <button type="submit">Agregar Producto</button>
    </form>
    <a href="/productos">Volver a la lista</a>
  `);
});
app.get("/productos/nuevo", (req, res) => {
  //formulario para agregar nuevo producto
  res.send(`
    <h1>Agregar Nuevo Producto</h1>
    <form method="POST" action="/productos">
    <label>Nombre: <input type="text" name="nombre" required></label><br>
    <label>Precio: <input type="number" step="0.01" name="precio" required></label><br>
    <label>Categoría: <input type="text" name="categoria" required></label><br>
      <button type="submit">Agregar Producto</button>
    </form>
    <a href="/productos">Volver a la lista</a>
  `);
});

//ruta con parámetro: ahora va después de las rutas específicas
app.get("/productos/:id", mostrarProductoIndividual); //detalle de un producto

// rutas de edición
app.get("/productos/:id/editar", mostrarFormularioEdicion); // mostrar formulario de edición
app.post("/productos/:id/editar", actualizarProducto); // procesar edición

//ruta para guardar nuevo producto
app.post("/productos", agregarProducto); //procesar formulario de nuevo producto

//ruta para eliminar un producto
app.post("/productos/:id/eliminar", eliminarProducto); //eliminar un producto

//iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
