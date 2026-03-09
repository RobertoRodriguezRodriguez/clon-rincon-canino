import { Uploader, Notification } from "rsuite";
import { useState } from "react";
import { uploadPhoto } from "../../services/photos";

export default function UploadPetPhoto({ petId, onUploadSuccess }) {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = (fileList) => {
    const lastFile = fileList[fileList.length - 1]?.blobFile;

    if (!lastFile) {
      Notification.error({ title: "Error", description: "No se seleccionó ningún archivo." });
      return;
    }

    const fd = new FormData();
    fd.append("id_pet", petId);
    fd.append("file", lastFile);

    uploadPhoto(fd)
      .then(() => {
        setUploadSuccess(true);
        Notification.success({ title: "Éxito", description: "Imagen subida correctamente." });
        if (onUploadSuccess) onUploadSuccess();
      })
      .catch((error) => {
        console.error("Error al subir la imagen:", error);
        Notification.error({ title: "Error", description: "Error al subir la imagen." });
      });
  };

  return (
    <div className="w-full relative group">
      {/* Decorative Accent Glow */}
      <div className="absolute inset-x-10 -bottom-2 h-1 bg-gradient-to-r from-brand-cyan/20 to-brand-violet/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Uploader
        accept="image/*"
        action=""
        autoUpload={false}
        multiple={false}
        draggable
        onChange={handleUpload}
        className="uploader-dark"
      >
        <div
          className="relative h-48 md:h-56 flex flex-col items-center justify-center border-2 border-dashed border-white/10 group-hover:border-brand-cyan/50 rounded-[2rem] p-6 text-center bg-[#161616] hover:bg-brand-cyan/5 transition-all duration-500 overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#1e1e1e] border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
              <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">📸</span>
            </div>
            <div className="space-y-1">
              <p className="text-white font-black text-xs uppercase tracking-[0.2em] group-hover:text-brand-cyan transition-colors">
                Sube la foto de tu mejor amigo
              </p>
              <p className="text-zinc-500 font-medium text-[10px] uppercase tracking-widest">
                Arrastra o haz click par seleccionar
              </p>
            </div>
          </div>
        </div>
      </Uploader>

      {uploadSuccess && (
        <div className="mt-4 flex items-center justify-center space-x-2 animate-in fade-in zoom-in duration-300">
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <p className="text-brand-cyan font-black text-[10px] uppercase tracking-widest">
            ¡Imagen subida con éxito!
          </p>
        </div>
      )}
    </div>
  );
}
