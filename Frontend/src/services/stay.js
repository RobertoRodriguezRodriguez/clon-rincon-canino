import { getDay } from "date-fns";

const url = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Obtener todas las estancias
export const getStayAll = async () => {
  try {
    const response = await fetch(`${url}/stay/all`);
    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Obtener una estancia específica (si aplica)
export const getStay = async () => {
  try {
    const response = await fetch(`${url}/stay`);
    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Obtener estancias de un cliente
export const getStayClient = async (userName) => {
  try {
    const response = await fetch(`${url}/stay/${userName}`);
    if (!response.ok) throw new Error("404");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Crear nueva estancia
export const createStay = async (fecha_inicio, fecha_fin, cupo) => {
  if (!fecha_inicio || !fecha_fin) {
    alert("Debes seleccionar una fecha de entrada y salida");
    return;
  }
  if (getDay(new Date(fecha_inicio)) === 0 || getDay(new Date(fecha_fin)) === 0) {
    alert("La fecha de entrada o salida no puede ser un domingo");
    return;
  }

  try {
    const response = await fetch(`${url}/stay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha_inicio, fecha_fin, cupo }),
    });

    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Modificar estancia existente
export const modStay = async (id, fecha_inicio, fecha_fin, cupo) => {
  if (!fecha_inicio || !fecha_fin) {
    alert("Debes seleccionar una fecha de entrada y salida");
    return;
  }
  if (getDay(new Date(fecha_inicio)) === 0 || getDay(new Date(fecha_fin)) === 0) {
    alert("La fecha de entrada o salida no puede ser un domingo");
    return;
  }

  try {
    const response = await fetch(`${url}/stay/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha_inicio, fecha_fin, cupo }),
    });

    if (!response.ok) throw new Error("Error al modificar la estancia");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log("Error al modificar la estancia:", error);
  }
};

// Eliminar estancia
export const deleteStay = async (id) => {
  try {
    const response = await fetch(`${url}/stay/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Obtener estancias por fecha
export const getStayByDate = async (fecha) => {
  try {
    const response = await fetch(`${url}/stay/${fecha}`);
    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Obtener estancias con condiciones especiales (si aplica)
export const getStayCondition = async (fecha) => {
  try {
    const response = await fetch(`${url}/stay/condicion/${fecha}`);
    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Obtener estancia por ID
export const getStayById = async (id) => {
  try {
    const response = await fetch(`${url}/stay/id/${id}`);
    if (!response.ok) throw new Error("401");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Update de una estancia existente
export const updateStay = async (id, fecha_inicio, fecha_fin, cupo) => {
  if (!fecha_inicio || !fecha_fin) {
    alert("Debes seleccionar una fecha de entrada y salida");
    return;
  }
  if (getDay(new Date(fecha_inicio)) === 0 || getDay(new Date(fecha_fin)) === 0) {
    alert("La fecha de entrada o salida no puede ser un domingo");
    return;
  }

  try {
    const response = await fetch(`${url}/stay/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha_inicio, fecha_fin, cupo }),
    });

    if (!response.ok) throw new Error("Error al modificar la estancia");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log("Error al modificar la estancia:", error);
  }
};