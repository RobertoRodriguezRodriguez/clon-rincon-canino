// server/routes/photos.js

import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Photos from "../../models/photos.js"; // Tu modelo Sequelize "Photos"
import * as fs from "fs";

const router = express.Router();

// 1) Configuración de Multer para guardar archivos en memoria
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// 2) POST /api/photos
//    Sube imagen y guarda el buffer en la BD
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo." });
    }

    if (!req.body.id_pet) {
      return res.status(400).json({
        error: "ID de la mascota (id_pet) no proporcionado.",
      });
    }

    const idPet = req.body.id_pet;
    const newId = uuidv4();
    
    const newPhoto = await Photos.create({
      id: newId,
      contenido: req.file.buffer,
      mimetype: req.file.mimetype,
      id_pet: idPet,
    });

    console.log("Nueva foto guardada en BD:", newId);
    
    // Devolvemos la foto sin el buffer para que la respuesta no sea pesada
    const { contenido, ...photoData } = newPhoto.toJSON();
    res.json(photoData);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: error.message });
  }
});


// 3) GET /api/photos
//    Obtiene todas las fotos de la BD (sin el contenido binario)
router.get("/", async (req, res) => {
  try {
    const photos = await Photos.findAll({
      attributes: { exclude: ['contenido'] }
    });
    res.json(photos);
  } catch (error) {
    console.error("Error al obtener las fotos:", error);
    res.status(500).json({ error: "No se pudieron obtener las fotos." });
  }
});

// 4) GET /api/photos/:id
//    Obtiene la info de UNA foto (sin el contenido binario)
router.get("/:id", async (req, res) => {
  try {
    const photo = await Photos.findByPk(req.params.id, {
      attributes: { exclude: ['contenido'] }
    });
    if (!photo) {
      return res.status(404).json({ error: "Foto no encontrada." });
    }
    res.json(photo);
  } catch (error) {
    console.error("Error al obtener la foto:", error);
    res.status(500).json({ error: error.message });
  }
});

// NUEVA RUTA: Sirve la imagen binaria directamente
router.get("/:id/image", async (req, res) => {
  try {
    const photo = await Photos.findByPk(req.params.id);
    if (!photo || !photo.contenido) {
      return res.status(404).send("Imagen no encontrada");
    }
    res.set("Content-Type", photo.mimetype);
    res.send(photo.contenido);
  } catch (error) {
    console.error("Error al servir la imagen:", error);
    res.status(500).send("Error al obtener la imagen");
  }
});

// 5) GET /api/photos/pet/:id
// Obtener las fotos de un pet por su ID (sin el contenido binario)
router.get("/pet/:id", async (req, res) => {
  try {
    const photos = await Photos.findAll({
      where: { id_pet: req.params.id },
      attributes: { exclude: ['contenido'] }
    });
    if (!photos || photos.length === 0) {
      return res.status(404).json({ error: "Fotos no encontradas." });
    }
    res.json(photos);
  } catch (error) {
    console.error("Error al obtener las fotos:", error);
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
    await photo.destroy();
    res.json({ message: "Foto eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
