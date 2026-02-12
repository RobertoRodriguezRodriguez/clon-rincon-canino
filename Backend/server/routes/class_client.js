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
        cliente.id AS id_cliente, 
        cliente.nombre AS nombre_cliente, 
        cliente.email AS email_cliente 
      FROM clase 
      INNER JOIN clase_cliente ON clase.id = clase_cliente.id_clase 
      INNER JOIN cliente ON cliente.id = clase_cliente.id_cliente 
      WHERE clase.cupo > 1 
      ORDER BY clase.fecha ASC
      LIMIT ? OFFSET ?;
    `,
      { replacements: [limit, offset] }
    );
    console.log("reservas en back",reservations);
    res.status(200).json(reservations);
  } catch (error) {
    logger.error("Error al obtener las reservas grupales:", error);
    res.status(500).json({ error: "Error al obtener las reservas grupales" });
  }
});

// Crear una nueva reserva
router.post("/", async (req, res) => {
  const { id_clase, id_cliente } = req.body;


  if (!id_clase ) {
    return res.status(400).json({ error: "Clase  no definida" });
  }

  if ( !id_cliente) {
    return res.status(400).json({ error: "Cliente no definido" });
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

    // Verificar si el cliente tiene mascota
    const [hasPet] = await sequelize.query(
      `SELECT mascota.nombre FROM cliente 
       LEFT JOIN mascota ON cliente.id = mascota.id_cliente 
       WHERE cliente.id = ?;`,
      { replacements: [id_cliente] }
    );

    if (!hasPet.some((pet) => pet.nombre)) {
      return res.status(400).json({ error: "El cliente debe registrar una mascota antes de reservar" });
    }

    // Verificar si ya existe la reserva para este cliente en esta clase
    const [reservationExists] = await sequelize.query(
      `SELECT id_clase FROM clase_cliente WHERE id_clase = ? AND id_cliente = ?;`,
      { replacements: [id_clase, id_cliente] }
    );

    if (reservationExists.length) {
      return res.status(400).json({ error: "El cliente ya tiene una reserva para esta clase" });
    }

    // Verificar cupo de la clase
    const [classCapacity] = await sequelize.query(
      `SELECT cupo FROM clase WHERE id = ?;`,
      { replacements: [id_clase] }
    );

    // Asegurar que cupo no sea NULL y establecer un valor alto si lo es
    const cupoMaximo = classCapacity.length && classCapacity[0].cupo !== null ? classCapacity[0].cupo : 1;

    // Obtener el número actual de reservas para la clase
    const [currentReservations] = await sequelize.query(
      `SELECT COUNT(*) AS total FROM clase_cliente WHERE id_clase = ?;`,
      { replacements: [id_clase] }
    );

    console.log(`Cupo máximo: ${cupoMaximo}, Reservas actuales: ${currentReservations[0].total}`);

    if (currentReservations[0].total >= cupoMaximo) {
      return res.status(400).json({ error: "La clase está llena" });
    }

    // Crear la reserva
    await sequelize.query(
      `INSERT INTO clase_cliente (id_clase, id_cliente) VALUES (?, ?);`,
      { replacements: [id_clase, id_cliente] }
    );

    res.status(201).json({ message: "Reserva creada correctamente" });
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

// Actualizar una reserva grupal
router.put("/edit-reservation", async (req, res) => {
  const { id_clase, id_cliente, nueva_fecha, nueva_hora_inicio, nueva_hora_fin } = req.body;

  console.log("Datos recibidos para editar reserva:", {
    id_clase,
    id_cliente,
    nueva_fecha,
    nueva_hora_inicio,
    nueva_hora_fin,
  });

  if (!id_clase || !id_cliente || !nueva_fecha || !nueva_hora_inicio || !nueva_hora_fin) {
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

    // Verificar relación clase-cliente
    const [reservationExists] = await sequelize.query(
      `SELECT * FROM clase_cliente WHERE id_clase = ? AND id_cliente = ?;`,
      { replacements: [id_clase, id_cliente], transaction }
    );

    if (!reservationExists.length) {
      throw new Error("Relación clase-cliente no encontrada");
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
  const { id_clase, id_cliente } = req.body;
  console.log("Datos recibidos en DELETE:", { id_clase, id_cliente });

  if (!id_clase || !id_cliente) {
    return res.status(400).json({ error: "Clase o cliente no definidos" });
  }

  try {
    await sequelize.query(
      `DELETE FROM clase_cliente WHERE id_clase = ? AND id_cliente = ?;`,
      { replacements: [id_clase, id_cliente] }
    );
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
        cliente.id AS id_cliente,
        cliente.nombre AS nombre_cliente,
        cliente.email AS email_cliente
      FROM clase
      INNER JOIN clase_cliente 
        ON clase.id = clase_cliente.id_clase
      INNER JOIN cliente 
        ON cliente.id = clase_cliente.id_cliente
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
