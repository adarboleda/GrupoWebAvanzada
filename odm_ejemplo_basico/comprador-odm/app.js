import express from 'express';
import mongoose from 'mongoose';
import Comprador from './models/comprador.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Conectar a la base de datos
mongoose
  .connect('mongodb://localhost:27017/tienda')
  .then(() => console.log('Conectado a MongoDB - Base de datos: tienda'))
  .catch((err) => console.error('Error de conexión:', err));

// ========== RUTAS API ==========

// POST - Crear un nuevo comprador
app.post('/compradores', async (req, res) => {
  try {
    const nuevoComprador = new Comprador(req.body);
    await nuevoComprador.save();
    res.status(201).json({
      success: true,
      message: 'Comprador creado exitosamente',
      data: nuevoComprador,
    });
  } catch (error) {
    console.error('Error al crear comprador:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear comprador',
      error: error.message,
    });
  }
});

// GET - Listar todos los compradores
app.get('/compradores', async (req, res) => {
  try {
    const compradores = await Comprador.find();
    res.status(200).json({
      success: true,
      cantidad: compradores.length,
      data: compradores,
    });
  } catch (error) {
    console.error('Error al listar compradores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar compradores',
      error: error.message,
    });
  }
});

// DELETE - Eliminar un comprador por ID
app.delete('/compradores/:id', async (req, res) => {
  try {
    const compradorEliminado = await Comprador.findByIdAndDelete(req.params.id);
    if (!compradorEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Comprador no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Comprador eliminado exitosamente',
      data: compradorEliminado,
    });
  } catch (error) {
    console.error('Error al eliminar comprador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar comprador',
      error: error.message,
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación: http://localhost:${PORT}/`);
});
