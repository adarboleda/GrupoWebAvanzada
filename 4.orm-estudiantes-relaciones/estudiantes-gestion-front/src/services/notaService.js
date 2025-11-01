const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Obtener todas las notas
export const obtenerTodasLasNotas = async () => {
  try {
    const response = await fetch(`${API_URL}/notas`);
    if (!response.ok) throw new Error("Error al obtener notas");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Crear una nueva nota
export const crearNota = async (nota) => {
  try {
    const response = await fetch(`${API_URL}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nota),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear nota");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actualizar una nota
export const actualizarNota = async (id, nota) => {
  try {
    const response = await fetch(`${API_URL}/notas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nota),
    });
    if (!response.ok) throw new Error("Error al actualizar nota");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Eliminar una nota
export const eliminarNota = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar nota");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Obtener una nota por ID
export const obtenerNotaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notas/${id}`);
    if (!response.ok) throw new Error("Error al obtener nota");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
