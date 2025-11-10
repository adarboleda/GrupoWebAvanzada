import { Arbol } from '../models/arbol.js';

// Crear un nuevo árbol con sus precios y descuentos
export const crearArbol = async (req, res) => {
  try {
    const arbol = await Arbol.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Árbol creado exitosamente',
      data: arbol,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener todos los árboles
export const obtenerArboles = async (req, res) => {
  try {
    const arboles = await Arbol.findAll();
    res.status(200).json({
      success: true,
      cantidad: arboles.length,
      data: arboles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Obtener un árbol por ID
export const obtenerArbolPorId = async (req, res) => {
  try {
    const arbol = await Arbol.findByPk(req.params.id);
    if (!arbol) {
      return res.status(404).json({
        success: false,
        error: 'Árbol no encontrado',
      });
    }
    res.status(200).json({
      success: true,
      data: arbol,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Actualizar un árbol
export const actualizarArbol = async (req, res) => {
  try {
    const arbol = await Arbol.findByPk(req.params.id);
    if (!arbol) {
      return res.status(404).json({
        success: false,
        error: 'Árbol no encontrado',
      });
    }
    await arbol.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Árbol actualizado exitosamente',
      data: arbol,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Eliminar un árbol
export const eliminarArbol = async (req, res) => {
  try {
    const arbol = await Arbol.findByPk(req.params.id);
    if (!arbol) {
      return res.status(404).json({
        success: false,
        error: 'Árbol no encontrado',
      });
    }
    await arbol.destroy();
    res.status(200).json({
      success: true,
      message: 'Árbol eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
