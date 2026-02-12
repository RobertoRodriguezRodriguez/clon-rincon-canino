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
    <div className="w-full">
      <Uploader
        accept="image/*"
        action=""
        autoUpload={false}
        multiple={false}
        draggable
        onChange={handleUpload}
      >
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #ddd",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <span>📸 Haz click o arrastra una imagen aquí para subirla</span>
        </div>
      </Uploader>

      {uploadSuccess && <p className="text-green-500 mt-2">✅ Imagen subida correctamente</p>}
    </div>
  );
}
