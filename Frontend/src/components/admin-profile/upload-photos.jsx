import { Cascader, Uploader, Message } from "rsuite";
import { useEffect, useState } from "react";

// Servicios que importas (ej. Axios)
import { getPets } from "../../services/pet";
import { getClientById } from "../../services/client";
import { uploadPhoto } from "../../services/photos";

const petsToData = async (pets) => {
  const result = await Promise.all(
    pets.map(async (pet) => {
      try {
        const owner = await getClientById(pet.id_cliente);
        return {
          label: `${pet.nombre} (${owner.nombre})`,
          value: pet.id,
        };
      } catch (error) {
        console.error(`Error obteniendo el dueño de la mascota ${pet.id}:`, error);
        return null;
      }
    })
  );
  return result.filter((item) => item !== null);
};

export default function UploadPhoto() {
  const [pets, setPets] = useState([]);
  const [owner, setOwner] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    getPets()
      .then((pets) => {
        setPets(pets);
        return petsToData(pets);
      })
      .then((data) => setOwner(data))
      .catch((error) => {
        console.error("Error cargando las mascotas:", error);
        Message.error("Error al cargar las mascotas.");
      });
  }, []);

  return (
    <div className="m-auto max-w-screen-lg py-8">
      <h2 className="mb-3 px-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl">
        Añadir imágenes de mascotas
      </h2>

      <div className="px-4 w-full py-1 space-y-3 rounded-lg">
        <Cascader
          placeholder="Selecciona una mascota"
          placement="auto"
          block
          data={owner}
          menuWidth={300}
          menuHeight={150}
          onChange={(value) => setSelectedPet(value)}
        />

        {selectedPet && (
          <Uploader
            accept="image/*"
            action=""
            autoUpload={false}
            multiple={false} 
            draggable
            onChange={(fileList) => {
              // Tomamos el último archivo que se haya agregado
              const lastFile = fileList[fileList.length - 1]?.blobFile;

              if (!lastFile) {
                Message.error?.("No se seleccionó ningún archivo.");
                return;
              }

              // Crear FormData y llenarlo con el archivo y el id_pet
              const fd = new FormData();
              fd.append("file", lastFile);
              fd.append("id_pet", selectedPet);

              // Subir la foto usando tu servicio uploadPhoto
              uploadPhoto(fd)
                .then(() => {
                  setUploadSuccess(true);
                  Message.success?.("Imagen subida correctamente.");
                })
                .catch((error) => {
                  console.error("Error al subir la imagen:", error);
                  Message.error?.("Error al subir la imagen.");
                });
            }}
          >
            <div
              style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>Haz click o arrastra la imagen a esta zona para subirla</span>
            </div>
          </Uploader>
        )}

        {uploadSuccess && (
          <p className="text-green-500">✅ Imagen subida correctamente</p>
        )}
      </div>
    </div>
  );
}
