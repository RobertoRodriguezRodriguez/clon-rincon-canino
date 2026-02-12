// server/routes/photos.js

import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Photos from "../../models/photos.js"; // Tu modelo Sequelize "Photos"
import * as fs from "fs";

const router = express.Router();

// Asegurarse de que la carpeta uploads exista
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 1) Configuración de Multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar la ruta absoluta para evitar problemas con el directorio de trabajo actual
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre de archivo único para evitar colisiones y problemas con caracteres especiales
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// 2) POST /api/photos
//    Sube imagen y guarda la ruta en la BD
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo." });
    }

    if (!req.body.id_pet) {
      return res.status(400).json({
        error: "ID de la mascota (id_pet) no proporcionado.",
      });
    }

    const idPet = req.body.id_pet;
    // Construir una ruta relativa para la URL que se guardará en la base de datos
    const urlPath = `uploads/${req.file.filename}`;

    // Buscar si ya existe una foto para la mascota
    const existingPhoto = await Photos.findOne({ where: { id_pet: idPet } });

    if (existingPhoto) {
      // Para eliminar el archivo antiguo, reconstruimos su ruta absoluta en el sistema de archivos
      const oldFilePath = path.join(process.cwd(), existingPhoto.contenido);
      try {
        fs.unlinkSync(oldFilePath);
        console.log("Archivo antiguo eliminado:", oldFilePath);
      } catch (err) {
        // Si el error es que el archivo no existe (ENOENT), lo ignoramos,
        // porque nuestro objetivo era eliminarlo de todos modos.
        if (err.code !== 'ENOENT') {
          console.error("Error al eliminar el archivo antiguo:", err);
        }
      }

      // Actualizar el registro existente con la nueva ruta de la foto
      existingPhoto.contenido = urlPath;
      await existingPhoto.save();
      console.log("Foto actualizada en BD:", existingPhoto.toJSON());
      return res.json(existingPhoto);
    }

    const newId = uuidv4();
    const newPhoto = await Photos.create({
      id: newId,
      contenido: urlPath,
      id_pet: idPet,
    });

    console.log("Nueva foto guardada en BD:", newPhoto.toJSON());
    res.json(newPhoto);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    // Si ocurre un error después de que el archivo se haya subido, lo eliminamos para no dejar basura.
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});


// 3) GET /api/photos
//    Obtiene todas las fotos de la BD (puedes ver sus rutas "contenido")
router.get("/", async (req, res) => {
  try {
    const photos = await Photos.findAll();
    res.json(photos);
  } catch (error) {
    console.error("Error al obtener las fotos:", error);
    res.status(500).json({ error: "No se pudieron obtener las fotos." });
  }
});

// 4) GET /api/photos/:id
//    Obtiene la info de UNA foto (según PK)
router.get("/:id", async (req, res) => {
  // console.log("REQ:", req.params.id)
  try {
    const photo = await Photos.findByPk(req.params.id);
    // console.log("FOTO back:", photo)
    if (!photo) {
      return res.status(404).json({ error: "Foto no encontrada." });
    }
    res.json(photo);
  } catch (error) {
    console.error("Error al obtener la foto:", error);
    res.status(500).json({ error: error.message });
  }
});

//5) GET /api/photos/pet/:id
// Obtener la foto de un pet por su ID
router.get("/pet/:id", async (req, res) => {
  try {
    const photo = await Photos.findOne({where: { id_pet: req.params.id}});
    console.log("FOTO back:", photo)
    if (!photo) {
      return res.status(404).json({ error: "Foto no encontrada." });
    }
    res.json(photo);
  } catch (error) {
    console.error("Error al obtener la foto:", error);
    res.status(500).json({ error: error.message });
  }
})

// 6) DELETE /api/photos/:id
router.delete("/:id", async (req, res) => {
  try {
    const photo = await Photos.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Foto no encontrada." });
    }
    const filePath = path.join(process.cwd(), photo.contenido);
    try {
      fs.unlinkSync(filePath);
      console.log("Archivo eliminado del sistema de archivos:", filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error("Error al eliminar el archivo del sistema de archivos:", err);
      }
    }
    await photo.destroy();
    res.json({ message: "Foto eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
