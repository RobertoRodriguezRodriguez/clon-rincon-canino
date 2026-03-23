import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";

import Pet from "../../models/pet.js";

const router = express.Router();

// Crear mascota
router.post("/", async (req, res) => {
  const { nombre, edad, castrado, vacunas, condicion_especial, id_cliente, sociable } = req.body;
  
  // Normalizar valores para evitar fallos de validación por nulls
  Pet.create({
    nombre: nombre,
    edad: edad !== null ? parseInt(edad) : 0,
    castrado: !!castrado,
    vacunas: !!vacunas,
    condicion_especial: !!condicion_especial,
    id_cliente: id_cliente,
    sociable: sociable !== undefined ? !!sociable : true, 
  }).then((pet) => {
    logger.info(`Mascota ${pet.dataValues["nombre"]} creada`);
    res.json(pet.dataValues);
  }).catch((error) => {
    console.error("Error en Pet.create:", error);
    res.status(500).json({ error: error.message });
  });
});

// Actualizar mascota
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, edad, castrado, vacunas, condicion_especial, sociable } = req.body;
  
  console.log("Datos recibidos para actualizar mascota:", { id, nombre, edad, castrado, vacunas, condicion_especial, sociable });

  // Construir objeto de actualización solo con campos provistos que no sean undefined
  const updateData = {};
  if (nombre !== undefined) updateData.nombre = nombre;
  if (edad !== undefined) updateData.edad = edad !== null ? parseInt(edad) : undefined;
  
  // Normalizar booleanos para evitar "notNull Violation" si vienen como null
  if (castrado !== undefined) updateData.castrado = castrado === null ? false : !!castrado;
  if (vacunas !== undefined) updateData.vacunas = vacunas === null ? false : !!vacunas;
  if (condicion_especial !== undefined) updateData.condicion_especial = condicion_especial === null ? false : !!condicion_especial;
  if (sociable !== undefined) updateData.sociable = sociable === null ? false : !!sociable;

  console.log("Objeto de actualización final (Sequelize):", updateData);

  Pet.update(updateData, {
    where: { id },
  }).then((result) => {
    logger.info(`Mascota ${id} actualizada. Campos: ${Object.keys(updateData).join(", ")}`);
    res.json(result);
  }).catch((error) => {
    console.error("Error en Pet.update:", error);
    res.status(500).json({ error: error.message });
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

// Obtener mascota(s) por ID de cliente
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // IMPORTANTE: Usamos sequelize.query para obtener un ARRAY de resultados
    const [results] = await sequelize.query(
      `SELECT * FROM mascota WHERE id_cliente = ?`,
      { replacements: [id] }
    );
    
    // Devolvemos el array completo (aunque sea de 1 elemento)
    res.status(200).json(results);
    logger.info(`Mascotas del cliente ${id} encontradas`);
    logger.info(results);
  } catch (error) {
    logger.error("Error al obtener mascotas:", error);
    res.status(500).json({ error: "Error al obtener las mascotas" });
  }
});

// ... resto del archivo


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
