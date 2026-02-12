// server/routes/class.js

import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";
import Class from "../../models/class.js";

const router = express.Router();

// Asigna numérico a días de la semana (opcional, si usas dayPicker)
const dayOfWeekNumber = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

/**
 * Función para obtener fechas para un día de la semana específico en un rango de fechas
 */
function getDatesForDayOfWeek(startDate, endDate, dayOfWeek) {
  const dates = [];
  let currentDate = new Date(startDate);
  endDate = new Date(endDate);

  const dayNumber = dayOfWeekNumber[dayOfWeek.toLowerCase()];

  while (currentDate <= endDate) {
    if (currentDate.getDay() === dayNumber) {
      dates.push(new Date(currentDate));
    }
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  logger.info(`Fechas encontradas: ${dates}`);
  return dates;
}

// ==========================================
// 1) Crear clase (POST /api/class)
// ==========================================
router.post("/", async (req, res) => {
  const { calendar, dayPicker, startTime, endTime, places } = req.body;

  if (calendar === "") {
    // Modo crear múltiples fechas
    const startDate = new Date().toLocaleDateString();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const dates = getDatesForDayOfWeek(
      startDate,
      endDate.toLocaleDateString(),
      dayPicker
    );

    const createClassPromises = dates.map((date) => {
      return Class.create({
        fecha: date,
        hora_inicio: startTime,
        hora_fin: endTime,
        cupo: places,
      });
    });

    Promise.all(createClassPromises)
      .then((classes) => {
        logger.info(
          "Clases creadas:",
          classes.map((c) => c.dataValues)
        );
        res.json(classes.map((c) => c.dataValues));
      })
      .catch((error) => {
        logger.error("Error al crear las clases:", error);
        res.json({ error: "Error al crear las clases" });
      });
  } else {
    // Modo crear una sola fecha
    Class.create({
      fecha: calendar,
      hora_inicio: startTime,
      hora_fin: endTime,
      cupo: places,
    })
      .then((clase) => {
        logger.info("Clase creada: ", clase.dataValues["fecha"]);
        res.json(clase.dataValues);
      })
      .catch((error) => {
        logger.error("Error al crear la clase única:", error);
        res.json({ error: "Error al crear la clase" });
      });
  }
});

// ==========================================
// 2) Mostrar todas las clases con detalle (GET /api/class/all)
//    usando un join con clase_cliente y cliente
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT id_clase, nombre, fecha, hora_inicio, hora_fin, cupo 
      FROM clase 
      INNER JOIN clase_cliente ON clase.id = clase_cliente.id_clase 
      INNER JOIN cliente ON cliente.id = clase_cliente.id_cliente;
    `);

    const clasesIndividuales = results.filter((c) => c.cupo === 1);
    const clasesGrupales = results
      .filter((c) => c.cupo > 1)
      .reduce((acc, c) => {
        if (!acc[c.id_clase]) {
          acc[c.id_clase] = {
            id_clase: c.id_clase,
            fecha: c.fecha,
            hora_inicio: c.hora_inicio,
            hora_fin: c.hora_fin,
            cupo: c.cupo,
            clientes: [],
          };
        }
        acc[c.id_clase].clientes.push(c.nombre);
        return acc;
      }, {});

    logger.info("Se muestran todas las clases con join");
    res.json({ clasesGrupales, clasesIndividuales });
  } catch (error) {
    logger.error("Error en /all classes:", error);
    res.status(500).json({ error: "Error interno al obtener clases" });
  }
});

// ==========================================
// 3) Mostrar clases disponibles (GET /api/class/available)
//    (sin clientes inscritos) => cupo varía
// ==========================================
router.get("/available", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT c.*, 
      COUNT(cc.id_cliente) AS inscritos
      FROM clase c
      LEFT JOIN clase_cliente cc ON c.id = cc.id_clase
      GROUP BY c.id
      HAVING inscritos < c.cupo;
    `);

    let clasesDisponiblesIndividual = [];
    let clasesDisponiblesGrupal = [];

    results.forEach((clase) => {
      if (clase.cupo === 1) {
        clasesDisponiblesIndividual.push(clase);
      } else if (clase.cupo > 1) {
        clasesDisponiblesGrupal.push(clase);
      }
    });

    logger.info("Clases disponibles (con cupos restantes) - /available");
    res.json({ clasesDisponiblesIndividual, clasesDisponiblesGrupal });
  } catch (error) {
    logger.error("Error en /available:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// ==========================================
// 4) Mostrar clases INDIVIDUALES (ya reservadas) => /api/class/individual
//    (INNER JOIN => las que tengan un cliente asociado)
// ==========================================
router.get("/individual", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        clase.id AS id_clase,
        clase.fecha,
        clase.hora_inicio,
        clase.hora_fin,
        cliente.id AS id_cliente,
        cliente.nombre AS nombre_cliente,
        cliente.email AS email_cliente
      FROM clase
      INNER JOIN clase_cliente ON clase.id = clase_cliente.id_clase
      INNER JOIN cliente ON cliente.id = clase_cliente.id_cliente
      WHERE clase.cupo = 1
      ORDER BY clase.fecha ASC;
    `);

    if (!results.length) {
      logger.info("No se encontraron clases individuales reservadas.");
      return res.status(404).json({ clasesDisponiblesIndividual: [] });
    }

    // Se devuelven las clases con la clave "clasesDisponiblesIndividual" para mantener consistencia
    res.status(200).json({ clasesDisponiblesIndividual: results });
  } catch (error) {
    logger.error("Error al obtener clases individuales reservadas:", error);
    res.status(500).json({ error: "Error al obtener clases individuales." });
  }
});

// ==========================================
// 5) Mostrar clases INDIVIDUALES DISPONIBLES => /api/class/individual/available
//    Cupo=1 y sin clientes inscritos (LEFT JOIN y cc.id_clase IS NULL)
// ==========================================
router.get("/individual/available", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT c.*
      FROM clase c
      LEFT JOIN clase_cliente cc ON c.id = cc.id_clase
      WHERE c.cupo = 1
        AND cc.id_clase IS NULL
      ORDER BY c.fecha ASC;
    `);

    if (!results.length) {
      logger.info("No hay clases individuales disponibles");
      return res.json({ clasesDisponiblesIndividual: [] });
    }

    logger.info("Clases individuales disponibles encontradas:", results.length);
    res.json({ clasesDisponiblesIndividual: results });
  } catch (error) {
    logger.error("Error al obtener clases individuales disponibles:", error);
    res.status(500).json({ error: "Error interno en /individual/available" });
  }
});

// ==========================================
// 6) Obtener clases de UN usuario (GET /api/class/:id)
//    (muestra las clases que tenga reservadas ese cliente)
// ==========================================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID de usuario no proporcionado" });
  }

  try {
    const [results] = await sequelize.query(`
      SELECT 
        clase.id AS id_clase,
        clase.fecha,
        clase.hora_inicio,
        clase.hora_fin,
        clase.cupo,
        cliente.id AS id_cliente,
        cliente.nombre AS nombre_cliente,
        cliente.email AS email_cliente
      FROM clase
      INNER JOIN clase_cliente ON clase.id = clase_cliente.id_clase
      INNER JOIN cliente ON cliente.id = clase_cliente.id_cliente
      WHERE cliente.id = '${id}'
      ORDER BY clase.fecha ASC;
    `);

    res.status(200).json(results);
  } catch (error) {
    logger.error("Error al obtener clases del usuario:", error);
    res.status(500).json({ error: "Error al obtener clases del usuario" });
  }
});

// ==========================================
// 7) Mostrar todas las clases sin join (GET /api/class)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const clases = await Class.findAll();
    logger.info("Clases encontradas - Tabla clase");
    res.json(clases);
  } catch (error) {
    logger.error("Error al listar clases sin join:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// ==========================================
// 8) Eliminar clase (DELETE /api/class/:id)
//    Solo si no tiene clientes inscritos
// ==========================================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    logger.error("ID de clase no especificado");
    return res.json({ error: "ID de clase no especificado" });
  }

  const [results] = await sequelize.query(`
    SELECT * FROM clase_cliente WHERE id_clase = '${id}';
  `);

  if (results.length > 0) {
    logger.error("No se puede eliminar una clase con clientes inscritos");
    return res.json({ error: "No se puede eliminar una clase con clientes inscritos" });
  }

  Class.destroy({ where: { id } })
    .then(() => {
      logger.info("Clase eliminada: ", id);
      // Devolvemos el listado de clases actualizadas
      Class.findAll().then((clases) => {
        res.json(clases);
      });
    })
    .catch((error) => {
      logger.error("Error al eliminar la clase:", error);
      res.json({ error: "Error al eliminar la clase" });
    });
});

// ==========================================
// 9) Actualizar clase (PUT /api/class/:id)
// ==========================================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { calendar, startTime, endTime, places } = req.body;

  if (!id) {
    logger.error("ID de clase no especificado");
    return res.status(400).json({ error: "ID de clase no especificado" });
  }

  try {
    // Buscar la clase que se desea actualizar
    const clase = await Class.findByPk(id);
    if (!clase) {
      logger.error("Clase no encontrada");
      return res.status(404).json({ error: "Clase no encontrada" });
    }

    // Actualizar los campos de la clase
    clase.fecha = calendar || clase.fecha;
    clase.hora_inicio = startTime || clase.hora_inicio;
    clase.hora_fin = endTime || clase.hora_fin;
    clase.cupo = places || clase.cupo;

    // Guardar los cambios
    await clase.save();

    logger.info("Clase actualizada: ", clase.dataValues);
    res.json(clase.dataValues);
  } catch (error) {
    logger.error("Error al actualizar la clase:", error);
    res.status(500).json({ error: "Error al actualizar la clase" });
  }
});


export default router;
