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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Galería Multimedia</h2>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Carga de <span className="text-zinc-500">Imágenes</span></h3>
        </div>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Asignar a Mascota</label>
            <Cascader
              placeholder="BUSCAR MASCOTA EN EL CENSO..."
              placement="auto"
              block
              data={owner}
              menuWidth={300}
              menuHeight={150}
              onChange={(value) => setSelectedPet(value)}
              className="custom-cascader"
            />
          </div>

          {selectedPet ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Uploader
                accept="image/*"
                action=""
                autoUpload={false}
                multiple={false}
                draggable
                onChange={(fileList) => {
                  const lastFile = fileList[fileList.length - 1]?.blobFile;
                  if (!lastFile) return;

                  const fd = new FormData();
                  fd.append("file", lastFile);
                  fd.append("id_pet", selectedPet);

                  uploadPhoto(fd)
                    .then(() => {
                      setUploadSuccess(true);
                      toaster.push(<Notification type="success" header="Imagen Sincronizada" />, { placement: "topEnd" });
                    })
                    .catch((error) => {
                      console.error("Error al subir la imagen:", error);
                      toaster.push(<Notification type="error" header="Error de Carga" />, { placement: "topEnd" });
                    });
                }}
                className="custom-uploader"
              >
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-cyan/30 transition-all group/drop">
                  <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-4 group-hover/drop:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Arrastra o haz clic para subir</span>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-2">Formatos aceptados: JPG, PNG, WEBP</p>
                </div>
              </Uploader>

              {uploadSuccess && (
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-bounce">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Transmisión Identidad Canina Completada</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-[2.5rem] bg-black/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 max-w-xs mx-auto">
                Selecciona una mascota por propietario para habilitar el canal de carga
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
