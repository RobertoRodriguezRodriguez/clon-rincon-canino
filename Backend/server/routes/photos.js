// server/routes/photos.js

import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Photos from "../../models/photos.js"; // Tu modelo Sequelize "Photos"
import * as fs from "fs";

const router = express.Router();

// 1) Configuración de Multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta local donde se guardarán los archivos
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // Generar un nombre único: timestamp + nombre original
    // o podrías usar uuid para el nombre
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
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
    const filePath = req.file.path;

    // Buscar si ya existe una foto para la mascota
    const existingPhoto = await Photos.findOne({ where: { id_pet: idPet } });

    if (existingPhoto) {
      // Eliminar la foto anterior del sistema de archivos
      if (fs.existsSync(existingPhoto.contenido)) {
        fs.unlinkSync(existingPhoto.contenido);
      }

      // Actualizar el registro existente con la nueva foto
      existingPhoto.contenido = filePath;
      await existingPhoto.save();
      console.log("Foto actualizada en BD:", existingPhoto.toJSON());
      return res.json(existingPhoto);
    }

    // Si no hay foto previa, crear un nuevo registro
    const newId = uuidv4();
    const newPhoto = await Photos.create({
      id: newId,
      contenido: filePath,
      id_pet: idPet,
    });

    console.log("Nueva foto guardada en BD:", newPhoto.toJSON());
    res.json(newPhoto);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
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
    if (fs.existsSync(photo.contenido)) {
      fs.unlinkSync(photo.contenido);
    }
    await photo.destroy();
    res.json({ message: "Foto eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
