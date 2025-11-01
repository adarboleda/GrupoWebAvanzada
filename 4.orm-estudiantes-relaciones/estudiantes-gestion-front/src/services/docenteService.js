const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Obtener todos los docentes
export const obtenerTodosLosDocentes = async () => {
  try {
    const response = await fetch(`${API_URL}/docentes`);
    if (!response.ok) throw new Error("Error al obtener docentes");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Crear un nuevo docente
export const crearDocente = async (docente) => {
  try {
    const response = await fetch(`${API_URL}/docentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docente),
    });
    if (!response.ok) throw new Error("Error al crear docente");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actualizar un docente
export const actualizarDocente = async (id, docente) => {
  try {
    const response = await fetch(`${API_URL}/docentes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docente),
    });
    if (!response.ok) throw new Error("Error al actualizar docente");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Eliminar un docente
export const eliminarDocente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/docentes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar docente");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Obtener un docente por ID
export const obtenerDocentePorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/docentes/${id}`);
    if (!response.ok) throw new Error("Error al obtener docente");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
