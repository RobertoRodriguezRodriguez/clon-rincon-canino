import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";
import StayClient from "../../models/stay_client.js";

const router = express.Router();

// Crear una nueva relación de estancia y cliente
router.post('/create', async (req, res) => {
  const { id_estancia, id_cliente, lista_espera } = req.body;


  if (!id_estancia || !id_cliente) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    // Obtener cupo máximo y reservas actuales
    const [status] = await sequelize.query(`
      SELECT 
        e.cupo AS maxCupo,
        COUNT(ec.id_cliente) AS currentBookings
      FROM estancia e
      LEFT JOIN estancia_cliente ec ON e.id = ec.id_estancia
      WHERE e.id = ?
      GROUP BY e.id;
    `, { replacements: [id_estancia] });

    if (!status.length) {
      return res.status(404).json({ error: "La estancia no existe." });
    }

    const { maxCupo, currentBookings } = status[0];

    if (currentBookings >= maxCupo) {
      return res.status(400).json({ error: "No hay cupo disponible para esta estancia." });
    }

    const newStayClient = await StayClient.create({
      id_estancia,
      id_cliente,
      lista_espera: lista_espera ?? false,
    });

    console.log(`Estancia ID ${id_estancia}: Reserva creada (ocupación: ${currentBookings + 1}/${maxCupo})`);

    res.status(201).json({
      message: "Relación creada correctamente",
      data: newStayClient,
    });
  } catch (error) {
    console.error("Error al crear la relación o actualizar cupo:", error);
    res.status(500).json({ error: "Error al crear la relación de estancia y cliente" });
  }
});

// Obtener todas las relaciones de estancia y cliente
router.get('/', async (req, res) => {
  try {
    const stays = await StayClient.findAll();
    res.status(200).json(stays);
  } catch (error) {
    console.error('Error al obtener las relaciones:', error);
    res.status(500).json({ error: 'Error al obtener las relaciones de estancia y cliente' });
  }
});

// Eliminar una relación de estancia y cliente
router.delete('/', async (req, res) => {
  const { id_estancia, id_cliente } = req.body;

  if (!id_estancia || !id_cliente) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const deleted = await StayClient.destroy({
      where: {
        id_estancia,
        id_cliente
      }
    });

    if (deleted) {
      console.log(`Estancia ID ${id_estancia}: Relación eliminada (cupo se recalcula dinámicamente).`);
      res.status(200).json({ message: 'Relación eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró la relación' });
    }
  } catch (error) {
    console.error('Error al eliminar la relación o restaurar cupo:', error);
    res.status(500).json({ error: 'Error al eliminar la relación de estancia y cliente' });
  }
});

// Obtener todas las relaciones de estancia y cliente
router.get('/all', async (req, res) => {
  try {
    const stays = await StayClient.findAll();
    res.status(200).json(stays);
  } catch (error) {
    console.error('Error al obtener las relaciones:', error);
    res.status(500).json({ error: 'Error al obtener las relaciones de estancia y cliente' });
  }
});

// Actualizar una relación de estancia y cliente
router.put("/edit-stay-client-reservation", async (req, res) => {
  const { id_estancia, id_cliente, nueva_id_estancia, nueva_id_cliente, lista_espera } = req.body;

  console.log("Datos recibidos para editar relación:", {
    id_estancia,
    id_cliente,
    nueva_id_estancia,
    nueva_id_cliente,
    lista_espera
  });

  // Validar que se envían los identificadores originales
  if (!id_estancia || !id_cliente) {
    return res.status(400).json({ error: "Datos incompletos: se requieren id_estancia e id_cliente" });
  }

  const transaction = await sequelize.transaction();

  try {
    // Verificar que la relación exista
    const [relacion] = await sequelize.query(
      `SELECT * FROM estancia_cliente WHERE id_estancia = ? AND id_cliente = ?;`,
      { replacements: [id_estancia, id_cliente], transaction }
    );

    if (!relacion.length) {
      throw new Error("Relación estancia-cliente no encontrada");
    }

    // Si la relación existe, actualizarla
    await sequelize.query(
      `UPDATE estancia_cliente
       SET 
         id_estancia = ?, 
         id_cliente = ?, 
         lista_espera = ?
       WHERE id_estancia = ? AND id_cliente = ?;`,
      {
        replacements: [
          nueva_id_estancia ?? id_estancia,  // Si no se pasa nueva_id_estancia, mantiene el valor antiguo
          nueva_id_cliente ?? id_cliente,    // Lo mismo con nueva_id_cliente
          lista_espera ?? relacion[0].lista_espera,  // Si no se pasa lista_espera, mantiene el valor anterior
          id_estancia,
          id_cliente
        ],
        transaction
      }
    );

    await transaction.commit();
    res.status(200).json({ message: "Relación actualizada correctamente" });

  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar la relación:", error);
    res.status(500).json({ error: error.message });
  }
});



// Obtener una relación de estancia y cliente por ID de la estancia y el id del cliente
router.get('/:id_estancia/:id_cliente', async (req, res) => {
  const { id_estancia, id_cliente } = req.params;

  try {
    const stayClient = await StayClient.findOne({
      where: {
        id_estancia,
        id_cliente
      }
    });

    if (!stayClient) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }

    res.status(200).json(stayClient);
  } catch (error) {
    console.error('Error al obtener la relación:', error);
    res.status(500).json({ error: 'Error al obtener la relación de estancia y cliente' });
  }
});

export default router;