import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { useEffect, useState } from "react";

// Importa tus servicios para llamadas a la API
import { getClient } from "../services/client";
import { getPet } from "../services/pet";

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [noPhotos, setNoPhotos] = useState(false);  // Estado para verificar si no hay fotos
  const [, setUser] = useState(null);
  const [, setPet] = useState(null);

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
              if (data) {
                setPhotos([data]);  // Solo se espera una foto, por eso la envuelvo en un array
                setNoPhotos(false);
                console.log("Foto obtenida:", data);
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
      <Navbar />
      <div className="flex flex-grow flex-wrap gap-4 justify-center pt-28 pb-10">
        {noPhotos ? (
          <p>No hay fotos disponibles</p>  // Mensaje si no hay fotos
        ) : (
          photos.map((photo) => {
            const rutaImagen = photo.contenido.replace(/\\/g, "/");
            console.log(rutaImagen);

            return (
              <img
                key={photo.id}
                className="h-auto max-w-full rounded-lg"
                src={`http://localhost:3001/${rutaImagen}`} // Asumiendo que la ruta en el servidor es correcta
                alt=""
                style={{ width: "400px", height: "300px", objectFit: "cover" }}
              />
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}
