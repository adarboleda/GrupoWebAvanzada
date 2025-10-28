/**
 * SERVICIO API - Comunicación con el backend
 * Maneja todas las peticiones HTTP al servidor Node.js (Controlador)
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Crear una nueva venta
 * @param {number} monto - Monto de la venta
 * @returns {Promise} - Datos de la venta creada
 */
export const crearVenta = async (monto) => {
  try {
    const response = await api.post('/ventas', { monto });
    return response.data.data;
  } catch (error) {
    console.error('Error al crear venta:', error);
    throw error;
  }
};

/**
 * Obtener todas las ventas
 * @returns {Promise} - Array de ventas
 */
export const obtenerVentas = async () => {
  try {
    const response = await api.get('/ventas');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de ventas
 * @returns {Promise} - Objeto con estadísticas
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get('/ventas/estadisticas');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * Obtener ventas por tipo
 * @param {string} tipo - Tipo de venta (A, B o C)
 * @returns {Promise} - Array de ventas del tipo especificado
 */
export const obtenerVentasPorTipo = async (tipo) => {
  try {
    const response = await api.get(`/ventas/tipo/${tipo}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener ventas por tipo:', error);
    throw error;
  }
};

/**
 * Eliminar todas las ventas
 * @returns {Promise}
 */
export const eliminarTodasVentas = async () => {
  try {
    const response = await api.delete('/ventas');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar ventas:', error);
    throw error;
  }
};

/**
 * Obtener una venta por ID
 * @param {number} id - ID de la venta
 * @returns {Promise} - Datos de la venta
 */
export const obtenerVentaPorId = async (id) => {
  try {
    const response = await api.get(`/ventas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    throw error;
  }
};

/**
 * Actualizar una venta existente
 * @param {number} id - ID de la venta
 * @param {number} monto - Nuevo monto de la venta
 * @returns {Promise} - Datos de la venta actualizada
 */
export const actualizarVenta = async (id, monto) => {
  try {
    const response = await api.put(`/ventas/${id}`, { monto });
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    throw error;
  }
};

/**
 * Eliminar una venta por ID
 * @param {number} id - ID de la venta
 * @returns {Promise}
 */
export const eliminarVenta = async (id) => {
  try {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    throw error;
  }
};
