import Navbar from "../components/navbar";
import NavbarAdmin from "../components/navbar-admin";
import Footer from "../components/footer";

import { useEffect, useState } from "react";

// Importa tus servicios para llamadas a la API
import { getClient } from "../services/client";
import { getPet } from "../services/pet";
import { deletePhoto } from "../services/photos";

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [noPhotos, setNoPhotos] = useState(false);  // Estado para verificar si no hay fotos
  const [user, setUser] = useState(null);
  const [, setPet] = useState(null);

  const handleDeletePhoto = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta foto?")) {
      try {
        await deletePhoto(id);
        // Remove the deleted photo from the state
        setPhotos(photos.filter(p => p.id !== id));
        if (photos.length === 1) { // If the last photo is deleted
          setNoPhotos(true);
        }
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        alert("Hubo un error al eliminar la foto.");
      }
    }
  };

  // Obtener el usuario y si es admin mostrar todas las fotos,
  // si no, mostrar las fotos de su mascota
  useEffect(() => {
    getClient().then((user) => {
      console.log("Usuario obtenido:", user);
      setUser(user);

      // Si hay error en el user (no logueado, etc.), salimos
      if (user.error) {
        return;
      }

      // Caso: usuario admin (id === "1")
      if (user.id === "1") {
        // Mostrar todas las fotos si es admin
        fetch("http://localhost:3001/api/photos")  // Cambié aquí la ruta para obtener todas las fotos
          .then((response) => {
            if (response.status === 404) {
              setNoPhotos(true);  // Si no se encuentran fotos
              setPhotos([]);
            } else {
              return response.json();
            }
          })
          .then((data) => {
            if (data && data.length > 0) {
              setPhotos(data);  // Establecemos todas las fotos en el estado
              setNoPhotos(false);
              console.log("Fotos obtenidas:", data);
            } else {
              setNoPhotos(true);
            }
          })
          .catch((error) => {
            console.error("Error al obtener las fotos:", error);
            setNoPhotos(true);
          });
      } else {
        // Caso: usuario normal
        getPet(user.id).then((pet) => {
          console.log("Mascota obtenida:", pet);
          setPet(pet);
          console.log("pet:", pet);

          // Realizar la consulta para obtener la foto de la mascota
          fetch(`http://localhost:3001/api/photos/pet/${pet.id}`)
            .then((response) => {
              if (response.status === 404) {
                setNoPhotos(true);  // Si no se encuentra la foto
                setPhotos([]);
              } else {
                return response.json();
              }
            })
            .then((data) => {
              if (data && data.length > 0) {
                setPhotos(data); // Ahora el backend devuelve un array de fotos
                setNoPhotos(false);
                console.log("Fotos obtenidas:", data);
              }
            })
            .catch((error) => {
              console.error("Error al obtener la foto:", error);
              setNoPhotos(true);
            });
        });
      }
    });
  }, []);

  return (
    <>
      {user && user.id === "1" ? <NavbarAdmin /> : <Navbar />}
      <div className="flex flex-grow flex-wrap gap-4 justify-center pt-28 pb-10">
        {noPhotos ? (
          <p>No hay fotos disponibles</p>  // Mensaje si no hay fotos
        ) : (
          photos.map((photo) => {
            const rutaImagen = photo.contenido.replace(/\\/g, "/");
            console.log(rutaImagen);
            console.log(photo);
            return (
              <div key={photo.id} className="relative inline-block m-2">
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={`http://localhost:3001/${rutaImagen}`} // Asumiendo que la ruta en el servidor es correcta
                  alt=""
                  style={{ width: "400px", height: "300px", objectFit: "cover" }}
                />
                {user && (
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full shadow-lg z-10"
                    title="Eliminar foto"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}
