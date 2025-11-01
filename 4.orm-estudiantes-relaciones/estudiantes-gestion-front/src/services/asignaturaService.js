const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Obtener todas las asignaturas
export const obtenerTodasLasAsignaturas = async () => {
  try {
    const response = await fetch(`${API_URL}/asignaturas`);
    if (!response.ok) throw new Error("Error al obtener asignaturas");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Crear una nueva asignatura
export const crearAsignatura = async (asignatura) => {
  try {
    const response = await fetch(`${API_URL}/asignaturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asignatura),
    });
    if (!response.ok) throw new Error("Error al crear asignatura");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actualizar una asignatura
export const actualizarAsignatura = async (id, asignatura) => {
  try {
    const response = await fetch(`${API_URL}/asignaturas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asignatura),
    });
    if (!response.ok) throw new Error("Error al actualizar asignatura");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Eliminar una asignatura
export const eliminarAsignatura = async (id) => {
  try {
    const response = await fetch(`${API_URL}/asignaturas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar asignatura");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Obtener una asignatura por ID
export const obtenerAsignaturaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/asignaturas/${id}`);
    if (!response.ok) throw new Error("Error al obtener asignatura");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
