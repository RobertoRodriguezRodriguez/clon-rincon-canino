import express from "express";
import sequelize from "../db.js";
import { Op } from "sequelize";
import { logger } from "../logger.js";
import Stay from "../../models/stay.js";

const router = express.Router();

// Crear estancia
router.post("/", async (req, res) => {
  const { fecha_inicio, fecha_fin, cupo } = req.body;

  // Verificar si faltan campos obligatorios
  if (!fecha_inicio || !fecha_fin || !cupo) {
    logger.error("Faltan campos obligatorios");
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Verificar si 'cupo' es un número válido
  if (isNaN(cupo) || cupo <= 0) {
    logger.error("El valor de 'cupo' debe ser un número mayor que 0");
    return res.status(400).json({ error: "El valor de 'cupo' debe ser un número mayor que 0" });
  }

  // Crear la estancia
  try {
    const stay = await Stay.create({
      id: Date.now().toString(), // Genera un ID único
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      cupo: parseInt(cupo, 10), // Asegura que 'cupo' sea un número entero
    });

    logger.info(
      `Estancia ${stay.dataValues["id"]} (Fecha Inicio: ${stay.dataValues["fecha_inicio"]}, Fecha Fin: ${stay.dataValues["fecha_fin"]}, Cupo: ${stay.dataValues["cupo"]}) creada`
    );

    // Responder con los datos de la estancia creada
    res.status(201).json(stay.dataValues);

  } catch (error) {
    logger.error(`Error al crear la estancia: ${error.message}`);
    res.status(500).json({ error: "Error al crear la estancia" });
  }
});

// Mostrar estancias
router.get("/all", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    `SELECT DISTINCT estancia.id, fecha_inicio, fecha_fin, cupo 
    FROM estancia;`
  );
  logger.info("Estancias encontradas: ", results);
  res.json(results);
});

// Mostrar estancias
router.get("/:nombre", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    `SELECT DISTINCT estancia.id, fecha_inicio, fecha_fin, cupo 
    FROM estancia
    INNER JOIN estancia_cliente ON estancia.id = estancia_cliente.id_estancia
    INNER JOIN cliente ON cliente.id = estancia_cliente.id_cliente
    WHERE cliente.nombre = '${req.params.nombre}';`
  );
  logger.info("Estancias encontradas: ", results);
  res.json(results);
});


// Mostrar estancias
router.get("/", async (req, res) => {
  Stay.findAll().then((stays) => {
    logger.info("Estancias encontradas", stays);
    res.json(stays);
  });
});

// Actualizar estancia
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fecha_inicio, fecha_fin, cupo } = req.body;

  if (!fecha_inicio || !fecha_fin || !cupo) {
    logger.error("Faltan campos obligatorios para modificar la estancia");
    res.json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const estancia = await Stay.findByPk(id);

    if (!estancia) {
      logger.error(`No se encontró la estancia con ID ${id}`);
      res.json({ error: "Estancia no encontrada" });
      return;
    }

    await estancia.update({
      fecha_inicio,
      fecha_fin,
      cupo,
    });

    logger.info(`Estancia ${id} actualizada correctamente`);
    res.json(estancia);
  } catch (error) {
    logger.error(`Error al modificar la estancia ${id}: ${error.message}`);
    res.json({ error: "Error al modificar la estancia" });
  }
});

// Mostrar número de estancias de una fecha que esté entre la fecha de entrada y la fecha de salida
router.get("/:fecha", async (req, res) => {
  const { fecha } = req.params;
  Stay.findAll({
    where: {
      [Op.and]: {
        fecha_inicio: {
          [Op.lte]: fecha,
        },
        fecha_fin: {
          [Op.gte]: fecha,
        },
      },
    },
  }).then((stays) => {
    logger.info("Estancias encontradas: ", stays);
    res.json(stays);
  });
});

// Eliminar estancia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const [results, metadata] = await sequelize.query(
    `DELETE FROM estancia WHERE id = '${id}';`
  );
  logger.info(`Estancia ${id} eliminada`);
  res.json(results);
});

// Obtener estancia por id
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM estancia WHERE id = '${id}';`
  );
  logger.info("Estancia encontrada: ", results);
  res.json(results);
});

export default router;
