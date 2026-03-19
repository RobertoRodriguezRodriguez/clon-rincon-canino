// services/stay_client.js
const url = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const getStayClients = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${url}/stay_client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener relaciones de estancia y cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.error("Error al obtener las relaciones de estancia y cliente:", error.message);
  }
};

export const createStayClient = async (id_estancia, id_mascota, fecha_inicio, fecha_fin, lista_espera = false) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${url}/stay_client/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ id_estancia, id_mascota, fecha_inicio, fecha_fin, lista_espera }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la relación estancia-cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.error("Error al crear la relación estancia-cliente:", error.message);
  }
};

export const getStayClientById = async (id_estancia, id_mascota) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${url}/stay_client/${id_estancia}/${id_mascota}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la relación estancia-cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.error("Error al obtener la relación estancia-cliente:", error.message);
  }
};

export const deleteStayClient = async (id_estancia, id_mascota) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${url}/stay_client`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
      body: JSON.stringify({ id_estancia, id_mascota }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la relación estancia-cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.error("Error al eliminar la relación estancia-cliente:", error.message);
  }
};

export const getStayClientAll = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${url}/stay_client/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener todas las relaciones de estancia y cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.error("Error al obtener todas las relaciones de estancia y cliente:", error.message);
  }
};

export const updateStayClient = async (id_estancia, id_mascota, nueva_id_estancia, nueva_id_mascota, fecha_inicio, fecha_fin, lista_espera) => {
  try {
    const token = sessionStorage.getItem("token");
    console.log('Datos enviados: ', id_estancia, id_mascota, nueva_id_estancia, nueva_id_mascota, fecha_inicio, fecha_fin, lista_espera);

    // Hacemos la solicitud PUT al endpoint correspondiente
    const response = await fetch(`${url}/stay_client/edit-stay-client-reservation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",  // Enviamos el token de autenticación si está presente
      },
      body: JSON.stringify({
        id_estancia,
        id_mascota,
        nueva_id_estancia,  // Enviamos nueva_id_estancia
        nueva_id_mascota,   // Enviamos nueva_id_mascota
        fecha_inicio,       // Enviamos fecha_inicio
        fecha_fin,          // Enviamos fecha_fin
        lista_espera        // Enviamos lista_espera
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la relación estancia-cliente");
    }

    const responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;  // Retorna la respuesta JSON si la actualización fue exitosa
  } catch (error) {
    console.error("Error al actualizar la relación estancia-cliente:", error.message);
    return { error: error.message };  // Retorna el mensaje de error en caso de fallo
  }
};

export const getStayReservationsByClientName = async (clientName) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${url}/stay_client/client/${clientName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener las estancias del cliente");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getStayReservationsByClientName:", error.message);
    return []; // Devuelve un array vacío para evitar errores en el frontend
  }
};
