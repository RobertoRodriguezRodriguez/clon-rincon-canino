import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Obtener todas las fotos
export const getPhotos = async () => {
  const response = await fetch(`${url}/photos`);
  const photos = await response.json();
  return photos;
};

export const getPhotosByPet = async (id) => {
  const response = await fetch(`${url}/photos/pet/${id}`);
  console.log("Response:", response);
  const photos = await response.json();
  console.log("foto get foto:", photos);
  return [photos];
};

// Función para subir una foto
export async function uploadPhoto(formData) {
  return axios.post("http://localhost:3001/api/photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
