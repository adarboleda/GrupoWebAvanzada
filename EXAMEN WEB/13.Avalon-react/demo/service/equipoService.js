const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class EquipoService {
  // Obtener todos los equipos
  async obtenerEquipos() {
    try {
      const response = await fetch(`${API_URL}/equipos`);
      if (!response.ok) {
        throw new Error("Error al obtener equipos");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en obtenerEquipos:", error);
      throw error;
    }
  }

  // Obtener un equipo por ID
  async obtenerEquipoPorId(id) {
    try {
      const response = await fetch(`${API_URL}/equipos/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el equipo");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en obtenerEquipoPorId:", error);
      throw error;
    }
  }

  // Crear un nuevo equipo
  async crearEquipo(equipo) {
    try {
      const response = await fetch(`${API_URL}/equipos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el equipo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en crearEquipo:", error);
      throw error;
    }
  }

  // Actualizar un equipo
  async actualizarEquipo(id, equipo) {
    try {
      const response = await fetch(`${API_URL}/equipos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el equipo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en actualizarEquipo:", error);
      throw error;
    }
  }

  // Eliminar un equipo
  async eliminarEquipo(id) {
    try {
      const response = await fetch(`${API_URL}/equipos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar el equipo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en eliminarEquipo:", error);
      throw error;
    }
  }
}
