import express from "express";
import {
  listarProductos,
  mostrarDetalleProducto,
  agregarProducto,
} from "./Controllers/productoController";

//inicializar express

const app = express();
const PORT = 3000;

//middleware para parsear el body de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//rutas
app.get("/", (req, res) => res.redirect("/productos"));
