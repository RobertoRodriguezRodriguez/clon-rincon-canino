import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";

import Pet from "../../models/pet.js";

const router = express.Router();

// Crear mascota
router.post("/", async (req, res) => {
  const { nombre, edad, castrado, vacunas, condicion_especial, id_cliente, sociable } = req.body;
  Pet.create({
    nombre: nombre,
    edad: edad,
    castrado: castrado,
    vacunas: vacunas,
    condicion_especial: condicion_especial,
    id_cliente: id_cliente,
    sociable: sociable, 
  }).then((pet) => {
    logger.info(`Mascota ${pet.dataValues["nombre"]} creada`);
    res.json(pet.dataValues);
  });
});

// Actualizar mascota
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, edad, castrado, vacunas, condicion_especial, sociable } = req.body;
  Pet.update(
    {
      nombre: nombre,
      edad: edad,
      castrado: castrado,
      vacunas: vacunas,
      condicion_especial: condicion_especial,
      sociable: sociable, // Ahora incluimos sociable en la actualización
    },
    {
      where: {
        id: id,
      },
    }
  ).then((pet) => {
    logger.info(`Mascota ${nombre} - ${id} actualizada`);
    res.json(pet);
  });
});

// Eliminar mascota
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  Pet.destroy({
    where: {
      id: id,
    },
  }).then((deleted) => {
    if (deleted) {
      logger.info(`Mascota con id ${id} eliminada`);
      res.json({ message: "Mascota eliminada correctamente" });
    } else {
      logger.error(`Mascota con id ${id} no encontrada`);
      res.status(404).json({ error: "Mascota no encontrada" });
    }
  }).catch((error) => {
    logger.error(`Error al eliminar mascota con id ${id}: ${error}`);
    res.status(500).json({ error: "Error al eliminar la mascota" });
  });
});

// Mostrar mascota de un usuario
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  Pet.findOne({
    where: {
      id_cliente: id,
    },
  }).then((pet) => {
    if (!pet) {
      if (id === '1') {
        return;
      }
      logger.error(`Mascota del cliente ${id} no encontrada`);
      res.json({ error: "Mascota no encontrada" });
      return;
    }
    logger.info(`Mascota del cliente ${pet.id_cliente} encontrada`);
    res.json(pet);
  });
});

// Obtener todas las mascotas con sus dueños
router.get("/all/info", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    `select distinct mascota.id, mascota.nombre as nombre_mascota, edad, castrado, vacunas, condicion_especial, sociable, cliente.nombre as nombre_cliente from mascota 
    inner join cliente on cliente.id = mascota.id_cliente;`
  );
  logger.info("Se muestran todas las mascotas con sus dueños", results);
  res.json(results);
});

// Obtener mascota por id
router.get("/pet/:id", async (req, res) => {
  const { id } = req.params;
  Pet.findOne({
    where: {
      id: id,
    },
  }).then((pet) => {
    logger.info(`Mascota ${pet.dataValues["nombre"]} - ${pet.dataValues["id"]} encontrada según id`);
    res.json(pet);
  });
});

// Obtener todas las mascotas
router.get("/", async (req, res) => {
  Pet.findAll().then((pets) => {
    logger.info("Se muestran todas las mascotas");
    res.json(pets);
  });
});

export default router;
