const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Obtener todos los estudiantes
export const obtenerTodosLosEstudiantes = async () => {
  try {
    const response = await fetch(`${API_URL}/estudiantes`);
    if (!response.ok) throw new Error("Error al obtener estudiantes");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Crear un nuevo estudiante
export const crearEstudiante = async (estudiante) => {
  try {
    const response = await fetch(`${API_URL}/estudiantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estudiante),
    });
    if (!response.ok) throw new Error("Error al crear estudiante");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actualizar un estudiante
export const actualizarEstudiante = async (id, estudiante) => {
  try {
    const response = await fetch(`${API_URL}/estudiantes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estudiante),
    });
    if (!response.ok) throw new Error("Error al actualizar estudiante");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Eliminar un estudiante
export const eliminarEstudiante = async (id) => {
  try {
    const response = await fetch(`${API_URL}/estudiantes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar estudiante");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Obtener un estudiante por ID
export const obtenerEstudiantePorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/estudiantes/${id}`);
    if (!response.ok) throw new Error("Error al obtener estudiante");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
