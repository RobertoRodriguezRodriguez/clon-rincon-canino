import { SelectPicker, Uploader, Notification, useToaster, Modal } from "rsuite";
import { useEffect, useState } from "react";

// Servicios
import { getPetsInfo } from "../../services/pet";
import { uploadPhoto } from "../../services/photos";

// No longer needed: petsToData simplified and integrated into useEffect

export default function UploadPhoto() {
  const [petData, setPetData] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const toaster = useToaster();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPetsInfo()
      .then((data) => {
        const formattedData = data.map((pet) => ({
          label: `${pet.nombre_mascota} (${pet.nombre_cliente})`,
          value: pet.id,
        }));
        setPetData(formattedData);
      })
      .catch((error) => {
        console.error("Error cargando las mascotas:", error);
        toaster.push(
          <Notification type="error" header="Error de Conexión" closable>
            No se pudo sincronizar el censo de mascotas.
          </Notification>
        );
      });
  }, []);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan">Galería Multimedia</h2>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Carga de <span className="text-zinc-500">Imágenes</span></h3>
          </div>
          <button
            onClick={handleOpen}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl hover:scale-[1.02]"
          >
            Iniciar Carga
          </button>
        </div>
      </div>

      <Modal open={showModal} onClose={handleClose} size="lg" className="custom-dark-modal">
        <Modal.Header className="pb-4 border-b border-white/5">
          <Modal.Title className="text-white font-black uppercase tracking-widest text-xs italic">
            Cargar <span className="text-brand-cyan">Recuerdo Fotográfico</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Columna Izquierda: Selector */}
            <div className="w-full lg:w-1/3 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Asignar a Mascota</label>
                <SelectPicker
                  placeholder="BUSCAR MASCOTA..."
                  placement="auto"
                  block
                  data={petData}
                  onChange={(value) => setSelectedPet(value)}
                  className="custom-selectpicker w-full z-300"
                  searchable
                />
              </div>
              {selectedPet && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Mascota Seleccionada.
                  </p>
                </div>
              )}
            </div>

            {/* Columna Derecha: Uploader o Placeholder */}
            <div className="w-full lg:w-2/3">
              {selectedPet ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
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
                    className="custom-uploader h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-cyan/30 transition-all group/drop">
                      <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-4 group-hover/drop:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Arrastra o haz clic para subir</span>
                      <p className="text-[8px] text-zinc-600 uppercase tracking-widest mt-2">Formatos: JPG, PNG, WEBP</p>
                    </div>
                  </Uploader>

                  {uploadSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-bounce">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Imagen Guardada</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] border border-white/5 rounded-[2.5rem] bg-black/20 text-center space-y-4 p-8">
                  <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 max-w-xs mx-auto">
                    Selecciona una mascota para habilitar la carga
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-4 border-t border-white/5">
          <button
            onClick={handleClose}
            className="w-full py-3 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors"
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>

      {/* CSS para forzar la visibilidad del SelectPicker en modo oscuro */}
      <style>{`
        .rs-picker-select-menu {
          background-color: #1a1a1a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .rs-picker-select-menu-item {
          color: #a1a1aa !important; /* zinc-400 */
          font-size: 0.8rem;
          font-weight: 500;
          padding: 10px 16px !important;
          transition: all 0.2s ease !important;
        }
        .rs-picker-select-menu-item:hover, .rs-picker-select-menu-item.rs-picker-select-menu-item-focus {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        .rs-picker-select-menu-item.rs-picker-select-menu-item-active {
          background-color: rgba(6, 182, 212, 0.1) !important; /* brand-cyan/10 */
          color: #06b6d4 !important; /* brand-cyan */
        }
        .rs-picker-search-bar-input {
          background-color: #27272a !important; /* zinc-800 */
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.5rem !important;
          padding: 8px 12px !important;
        }
        .rs-picker-search-bar-input:focus {
          border-color: rgba(6, 182, 212, 0.5) !important;
        }
      `}</style>
    </>
  );
}
