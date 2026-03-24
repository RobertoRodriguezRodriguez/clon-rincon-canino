const url = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://clon-rincon-canino-back.onrender.com/api");

export const getPetById = async (id) => {
  try {
    const response = await fetch(`${url}/pet/pet/${id}`, {
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

export async function getPet(id) {
  try {
    const response = await fetch(`${url}/pet/${id}`, {
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
}

// Función para obtener las mascotas
export const getPetsInfo = async () => {
  try {
    const response = await fetch(`${url}/pet/all/info`, {
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

// Función para obtener las mascotas
export const getPets = async () => {
  try {
    const response = await fetch(`${url}/pet`, {
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

//PUT request to update pet info
export async function updatePetInfo(
  pet_id,
  nombre,
  edad,
  castrado,
  vacunas,
  condicion_especial,
  sociable
) {
  try {
    const response = await fetch(`${url}/pet/${pet_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        edad,
        castrado,
        vacunas,
        condicion_especial,
        sociable,
      }),
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

export const createPet = async (
  nombre,
  edad,
  castrado,
  vacunas,
  condicion_especial,
  id_cliente,
  sociable
) => {
  try {
    const token = await fetch(`${url}/pet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        edad,
        castrado,
        vacunas,
        condicion_especial,
        id_cliente,
        sociable,
      }),
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
};

export const deletePet = async (id) => {
  try {
    const response = await fetch(`${url}/pet/${id}`, {
      method: "DELETE",
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