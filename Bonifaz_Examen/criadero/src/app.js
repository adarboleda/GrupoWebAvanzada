import express from "express";
import cors from "cors";
import { connectDB } from "./config/mongo.js";
import 'dotenv/config';
import criaderoRoutes from "./routes/criaderoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/criadero", criaderoRoutes);

await connectDB();

app.listen(
    process.env.PORT, () => 
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
);
