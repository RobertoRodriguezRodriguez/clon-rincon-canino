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
  try {
    const [results] = await sequelize.query(`
      SELECT 
        e.id, 
        e.fecha_inicio, 
        e.fecha_fin, 
        (e.cupo - COALESCE(sub.total, 0)) AS cupo
      FROM estancia e
      LEFT JOIN (
        SELECT id_estancia, COUNT(*) AS total FROM mascota_estancia GROUP BY id_estancia
      ) sub ON e.id = sub.id_estancia;
    `);
    logger.info("Estancias encontradas (cupo dinámico): ", results);
    res.json(results);
  } catch (error) {
    logger.error("Error al obtener todas las estancias:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// Mostrar estancias de un cliente con cupo dinámico
router.get("/:nombre", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        e.id, 
        e.fecha_inicio, 
        e.fecha_fin, 
        (e.cupo - COALESCE(sub.total, 0)) AS cupo
      FROM estancia e
      INNER JOIN mascota_estancia me ON e.id = me.id_estancia
      INNER JOIN mascota m ON m.id = me.id_mascota
      INNER JOIN cliente cli ON cli.id = m.id_cliente
      LEFT JOIN (
        SELECT id_estancia, COUNT(*) AS total FROM mascota_estancia GROUP BY id_estancia
      ) sub ON e.id = sub.id_estancia
      WHERE cli.nombre = :nombre;
    `, { replacements: { nombre: req.params.nombre } });

    logger.info("Estancias del cliente encontradas: ", results);
    res.json(results);
  } catch (error) {
    logger.error("Error al obtener estancias del cliente:", error);
    res.status(500).json({ error: "Error interno" });
  }
});


// Mostrar estancias sin filtros con cupo dinámico
router.get("/", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        e.id, 
        e.fecha_inicio, 
        e.fecha_fin, 
        (e.cupo - COALESCE(sub.total, 0)) AS cupo
      FROM estancia e
      LEFT JOIN (
        SELECT id_estancia, COUNT(*) AS total FROM mascota_estancia GROUP BY id_estancia
      ) sub ON e.id = sub.id_estancia;
    `);
    res.json(results);
  } catch (error) {
    logger.error("Error en GET /estancia:", error);
    res.status(500).json({ error: "Error interno" });
  }
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
  try {
    const [results] = await sequelize.query(`
      SELECT 
        e.id, 
        e.fecha_inicio, 
        e.fecha_fin, 
        (e.cupo - COALESCE(sub.total, 0)) AS cupo
      FROM estancia e
      LEFT JOIN (
        SELECT id_estancia, COUNT(*) AS total FROM mascota_estancia GROUP BY id_estancia
      ) sub ON e.id = sub.id_estancia
      WHERE e.fecha_inicio <= :fecha AND e.fecha_fin >= :fecha;
    `, { replacements: { fecha } });

    res.json(results);
  } catch (error) {
    logger.error("Error en GET /estancia/:fecha:", error);
    res.status(500).json({ error: "Error interno" });
  }
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
  try {
    const [results] = await sequelize.query(`
      SELECT 
        e.*, 
        (e.cupo - COALESCE(sub.total, 0)) AS cupo_actual
      FROM estancia e
      LEFT JOIN (
        SELECT id_estancia, COUNT(*) AS total FROM mascota_estancia GROUP BY id_estancia
      ) sub ON e.id = sub.id_estancia
      WHERE e.id = :id;
    `, { replacements: { id } });

    if (results.length > 0) {
      // Map cupo_actual to cupo for frontend consistency
      const result = { ...results[0], cupo: results[0].cupo_actual };
      res.json([result]);
    } else {
      res.status(404).json({ error: "Estancia no encontrada" });
    }
  } catch (error) {
    logger.error("Error en GET /estancia/id/:id:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
