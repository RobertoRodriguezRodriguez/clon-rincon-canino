import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";
import dayjs from "dayjs";

const router = express.Router();

// Obtener reservas grupales con paginación
router.get("/group-reservations", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [reservations] = await sequelize.query(
      `
      SELECT DISTINCT 
        clase.id AS id_clase, 
        clase.fecha, 
        clase.hora_inicio, 
        clase.hora_fin, 
        mascota.id AS id_mascota,
        mascota.nombre AS nombre_mascota,
        cliente.id AS id_cliente, 
        cliente.nombre AS nombre_cliente, 
        cliente.email AS email_cliente 
      FROM clase 
      INNER JOIN mascota_clase ON clase.id = mascota_clase.id_clase 
      INNER JOIN mascota ON mascota.id = mascota_clase.id_mascota
      INNER JOIN cliente ON cliente.id = mascota.id_cliente 
      WHERE clase.cupo > 1 
      ORDER BY clase.fecha ASC
      LIMIT ? OFFSET ?;
    `,
      { replacements: [limit, offset] }
    );
    console.log("reservas en back", reservations);
    res.status(200).json(reservations);
  } catch (error) {
    logger.error("Error al obtener las reservas grupales:", error);
    res.status(500).json({ error: "Error al obtener las reservas grupales" });
  }
});

// Crear una nueva reserva
router.post("/", async (req, res) => {
  const { id_clase, id_mascota } = req.body;
  console.log("POST /api/class_client - BODY:", req.body);


  if (!id_clase) {
    return res.status(400).json({ error: "ERR_BACKEND_CLASE_MISSING" });
  }

  if (!id_mascota) {
    return res.status(400).json({ error: "ERR_BACKEND_MASCOTA_MISSING" });
  }

  try {
    // Verificar si la clase existe
    const [classExists] = await sequelize.query(
      `SELECT id FROM clase WHERE id = ?;`,
      { replacements: [id_clase] }
    );

    if (!classExists.length) {
      return res.status(404).json({ error: "La clase no existe" });
    }

    // Verificar si la mascota existe
    const [petExists] = await sequelize.query(
      `SELECT nombre FROM mascota WHERE id = ?;`,
      { replacements: [id_mascota] }
    );

    if (!petExists.length) {
      return res.status(400).json({ error: "La mascota no existe" });
    }

    // Verificar si ya existe la reserva para esta mascota en esta clase
    const [reservationExists] = await sequelize.query(
      `SELECT id_clase FROM mascota_clase WHERE id_clase = ? AND id_mascota = ?;`,
      { replacements: [id_clase, id_mascota] }
    );

    if (reservationExists.length) {
      return res.status(400).json({ error: "Esta mascota ya tiene una reserva para esta clase" });
    }

    // Obtener cupo máximo y reservas actuales en una sola consulta
    const [status] = await sequelize.query(`
      SELECT 
        c.cupo AS maxCupo,
        COUNT(mc.id_mascota) AS currentReservations
      FROM clase c
      LEFT JOIN mascota_clase mc ON c.id = mc.id_clase
      WHERE c.id = ?
      GROUP BY c.id;
    `, { replacements: [id_clase] });

    if (!status.length) {
      return res.status(404).json({ error: "La clase no existe" });
    }

    const { maxCupo, currentReservations } = status[0];

    if (currentReservations >= maxCupo) {
      return res.status(400).json({ error: "No hay cupo disponible para esta clase." });
    }

    // Crear la reserva
    await sequelize.query(
      `INSERT INTO mascota_clase (id_clase, id_mascota) VALUES (?, ?);`,
      { replacements: [id_clase, id_mascota] }
    );

    res.status(201).json({ message: "Reserva creada correctamente" });

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

// Actualizar una reserva grupal
router.put("/edit-reservation", async (req, res) => {
  const { id_clase, id_mascota, nueva_fecha, nueva_hora_inicio, nueva_hora_fin } = req.body;

  console.log("Datos recibidos para editar reserva:", {
    id_clase,
    id_mascota,
    nueva_fecha,
    nueva_hora_inicio,
    nueva_hora_fin,
  });

  if (!id_clase || !id_mascota || !nueva_fecha || !nueva_hora_inicio || !nueva_hora_fin) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const transaction = await sequelize.transaction();

  try {
    // Actualizar detalles de la clase
    const [updatedClass] = await sequelize.query(
      `UPDATE clase SET fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?;`,
      { replacements: [nueva_fecha, nueva_hora_inicio, nueva_hora_fin, id_clase], transaction }
    );

    if (updatedClass.affectedRows === 0) {
      throw new Error("Clase no encontrada");
    }

    // Verificar relación clase-mascota
    const [reservationExists] = await sequelize.query(
      `SELECT * FROM mascota_clase WHERE id_clase = ? AND id_mascota = ?;`,
      { replacements: [id_clase, id_mascota], transaction }
    );

    if (!reservationExists.length) {
      throw new Error("Relación clase-mascota no encontrada");
    }

    // Confirmar transacción
    await transaction.commit();
    res.status(200).json({ message: "Reserva actualizada correctamente" });
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error("Error al actualizar la reserva:", error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una reserva grupal
router.delete("/", async (req, res) => {
  const { id_clase, id_mascota } = req.body;
  console.log("Datos recibidos en DELETE:", { id_clase, id_mascota });

  if (!id_clase || !id_mascota) {
    return res.status(400).json({ error: "Clase o mascota no definidas" });
  }

  try {
    await sequelize.query(
      `DELETE FROM mascota_clase WHERE id_clase = ? AND id_mascota = ?;`,
      { replacements: [id_clase, id_mascota] }
    );

    console.log(`Clase ID ${id_clase}: Reserva eliminada (cupo se recalcula dinámicamente).`);
    res.status(200).json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    logger.error("Error al eliminar la reserva grupal:", error);
    res.status(500).json({ error: "Error al eliminar la reserva grupal" });
  }
});

// Obtener clases de un usuario específico (ruta dinámica)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de usuario no proporcionado" });
  }

  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        clase.id AS id_clase,
        clase.fecha,
        clase.hora_inicio,
        clase.hora_fin,
        clase.cupo,
        mascota.id AS id_mascota,
        mascota.nombre AS nombre_mascota,
        cliente.id AS id_cliente,
        cliente.nombre AS nombre_cliente,
        cliente.email AS email_cliente
      FROM clase
      INNER JOIN mascota_clase 
        ON clase.id = mascota_clase.id_clase
      INNER JOIN mascota
        ON mascota.id = mascota_clase.id_mascota
      INNER JOIN cliente 
        ON cliente.id = mascota.id_cliente
      WHERE cliente.id = ?
      ORDER BY clase.fecha ASC;
    `,
      { replacements: [id] }
    );

    res.status(200).json(results);
  } catch (error) {
    logger.error("Error al obtener clases del usuario:", error);
    res.status(500).json({ error: "Error al obtener clases del usuario" });
  }
});

export default router;
