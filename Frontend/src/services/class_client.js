const url = import.meta.env.VITE_API_URL;
import axios from 'axios';

// Crear una reserva
export async function createReservation(id_clase, id_cliente) {
  try {
    const token = await fetch(`${url}/class_client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_clase,
        id_cliente,
      }),
    });

    if (!token.ok) {
      throw new Error("401");
    }

    const tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }
  } catch (error) {
    console.log(error);
  }
}

// Editar una reserva existente

export async function editReservation(id_clase, id_cliente, nueva_fecha, nueva_hora_inicio, nueva_hora_fin) {
  try {
    const response = await fetch(`${url}/class_client/edit-reservation`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_clase,
        id_cliente,
        nueva_fecha,
        nueva_hora_inicio,
        nueva_hora_fin,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (error) {
    console.error("Error en editReservation:", error.message);
    throw error;
  }
}


// Eliminar una reserva
// Ajusta la firma de la función para aceptar ambos parámetros
export async function deleteReservation(id_clase, id_cliente) {
  try {
    const token = await fetch(`${url}/class_client`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_clase,
        id_cliente,
      }),
    });

    if (!token.ok) {
      throw new Error("401");
    }

    const tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }
  } catch (error) {
    console.log(error);
  }
}


// Mostrar proxima clases en perfil de usuario
export async function getReservations(id) {
  try {
    const token = await fetch(`${url}/class`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!token.ok) {
      throw new Error("401");
    }

    const tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }

    return tokenJSON;
  } catch (error) {
    console.log(error);
  }
}
// Obtener todas las reservas grupales realizadas por clientes
export async function getGroupReservations() {
  try {
    const response = await axios.get('/api/class_client/group-reservations');
    // console.log("Respuesta completa del backend:", response.data); // Depuración
    return response.data;
  } catch (error) {
    console.error("Error en getGroupReservations:", error);
    throw error;
  }
}

export const getIndividualReservations = async () => {
  try {
    const response = await axios.get("/api/class_client/individual");
    return response.data;
  } catch (error) {
    console.error("Error al obtener reservas individuales:", error);
    throw error;
  }
};








