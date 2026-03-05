const url = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getClient(navigate) {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(`${url}/client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? "",
      },
    });

    if (!response.ok) {
      throw new Error("401");
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.log(error);
  }
}

// Función para obtener un usuario por id
export const getClientById = async (id) => {
  try {
    const response = await fetch(`${url}/client/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("401");
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.log(error);
  }
};

export const getClients = async () => {
  try {
    const token = await fetch(`${url}/client/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!token.ok) {
      throw new Error("401");
    }

    let tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }

    return tokenJSON;
  } catch (error) {
    console.log(error);
  }
};

export const getClientsInfo = async () => {
  try {
    const token = await fetch(`${url}/client/info-client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!token.ok) {
      throw new Error("401");
    }

    let tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }

    return tokenJSON;
  } catch (error) {
    console.log(error);
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await fetch(`${url}/client/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Mejora en el mensaje de error
      throw new Error(`Error al eliminar cliente: ${response.statusText}`);
    }

    // Verifica si hay contenido en la respuesta antes de hacer json()
    if (response.status !== 204) { // Si el código de estado no es 204 (No Content)
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } else {
      // Si la respuesta es vacía (204 No Content), devuelve un mensaje de éxito
      return { success: true };
    }

  } catch (error) {
    console.error("Error al intentar eliminar el cliente:", error.message);
    throw error; // Propaga el error para que el componente lo maneje
  }
};

export const desactivateClient = async (id) => {
  try {
    const response = await fetch(`${url}/client/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("401");
    }

    // Verificar si la respuesta tiene contenido antes de intentar parsearla
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (data && data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("Error al intentar desactivar el cliente:", error.message);
  }
};




export const activeClient = async (id) => {
  try {
    const token = await fetch(`${url}/client/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!token.ok) {
      throw new Error("401");
    }

    let tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }

    return tokenJSON;
  } catch (error) {
    console.log(error);
  }
};

export const updateClient = async (data) => {
  try {
    const response = await fetch(`${url}/client/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("401");
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON;
  } catch (error) {
    console.log(error);
  }
};

export const createClient = async (nombre, telefono, dni, email, password, repeatPassword, navigate) => {
  try {
    if (password !== repeatPassword) {
      alert("Passwords do not match");
      throw new Error("Passwords do not match");
    }

    const response = await fetch(`${url}/client`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        telefono,
        dni,
        email,
        password,
      }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    alert(error);
  }
};
// client.js
export const changePassword = async (email, password) => {
  try {
    // Eliminamos los parámetros de la URL y usamos el body
    const response = await fetch(`${url}/client/change-password`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Enviamos los datos seguros aquí
    });

    // Validamos si la respuesta es OK antes de intentar convertir a JSON
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al cambiar la contraseña");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};