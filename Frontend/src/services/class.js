const url = import.meta.env.VITE_API_URL || "http://localhost:3001/api";


// Ordena las reservas por fecha en orden ascendente
function sortClasses(classes) {
  if (!Array.isArray(classes)) {
    // Handle the case where classes is not an array
    return [];
  }

  return classes.sort((a, b) => {
    if (a.fecha < b.fecha) {
      return -1;
    }
    if (a.fecha > b.fecha) {
      return 1;
    }
    return 0;
  });
}

// Obtiene las horas de las clases individuales
export const getClasses = async () => {
  try {
    const response = await fetch(`${url}/class/all`, {
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

// Crea una clase
export const createClass = async (calendar, dayPicker, startTime, endTime, places) => {
  try {
    const token = await fetch(`${url}/class`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calendar,
        dayPicker,
        startTime,
        endTime,
        places,
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

// Obtiene las clases individuales
export const getClass = async () => {
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

    let tokenJSON = await token.json();

    if (tokenJSON.error) {
      throw new Error(tokenJSON.error);
    }

    tokenJSON = sortClasses(tokenJSON);

    return tokenJSON;
  } catch (error) {
    console.log(error);
  }
};

// Elimina una clase
// class.js (sin hooks)
export const deleteClass = async (id) => {
  try {
    const response = await fetch(`${url}/class/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("401");
    }

    let data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    data = sortClasses(data);  // Si necesitas ordenar las clases

    return data;  // Devolvemos los datos actualizados
  } catch (error) {
    console.error("Error al eliminar clase:", error);
    throw error;  // Lanza el error para que sea manejado fuera
  }
};


// Obtener las clases con cupo > 1
export const getAvailableClass = async () => {
  try {
    const response = await fetch(`${url}/class/available`, {
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

export const getIndividualClass = async () => {
  try {
    const response = await fetch(`${url}/class/individual`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON.clasesDisponiblesIndividual || []; // ✅ Manejo seguro de datos
  } catch (error) {
    console.error("Error obteniendo clases individuales reservadas:", error);
    return [];
  }
};


// Obtiene las clases individuales disponibles
export const getIndividualClassAvailable = async () => {
  try {
    const response = await fetch(`${url}/class/individual/available`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON.clasesDisponiblesIndividual || []; // ✅ Manejo seguro de datos
  } catch (error) {
    console.error("Error obteniendo clases individuales disponibles:", error);
    return [];
  }
};

// Actualiza una clase existente
export const updateClass = async (classId, updatedData) => {
  try {
    const response = await fetch(`${url}/class/${classId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la clase");
    }

    let responseJSON = await response.json();

    if (responseJSON.error) {
      throw new Error(responseJSON.error);
    }

    return responseJSON; // Devuelve la clase actualizada
  } catch (error) {
    console.error("Error actualizando clase:", error);
    throw error; // Lanza el error para que sea manejado fuera
  }
};
