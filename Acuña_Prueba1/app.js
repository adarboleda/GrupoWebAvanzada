import express from "express";
import descuentoRoutes from "./routes/descuentoRoutes.js";
import { PORT } from "./config/.env";
import { vistaResultado } from "./Views/descuentoView.js";

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// redirigir al formulario de descuento y usar router
app.get("/", (req, res) => res.redirect("/descuento"));
app.use("/", descuentoRoutes);


//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor esta corriendo en http://localhost:${PORT}`);
});