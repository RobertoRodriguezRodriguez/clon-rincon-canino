import express from "express";
import sequelize from "../db.js";
import { logger } from "../logger.js";
import StayClient from "../../models/stay_client.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const router = express.Router();

// Crear una nueva relación de estancia y mascota
router.post('/create', async (req, res) => {
  const { id_estancia, id_mascota, fecha_inicio, fecha_fin } = req.body;

  if (!id_estancia || !id_mascota || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const userStart = dayjs(fecha_inicio);
  const userEnd = dayjs(fecha_fin);

  if (userEnd.isBefore(userStart)) {
    return res.status(400).json({ error: "La fecha de fin no puede ser anterior a la de inicio" });
  }

  try {
    // 1. Obtener información de la estancia (rango habilitado y cupo total)
    const [estanciaData] = await sequelize.query(
      `SELECT * FROM estancia WHERE id = ?`,
      { replacements: [id_estancia] }
    );

    if (!estanciaData.length) {
      return res.status(404).json({ error: "Estancia no encontrada" });
    }

    const estancia = estanciaData[0];
    const adminStart = dayjs(estancia.fecha_inicio);
    const adminEnd = dayjs(estancia.fecha_fin);
    const cupoMaximo = estancia.cupo;

    // 2. Comprobar que el rango del usuario está dentro del habilitado por la administradora
    if (userStart.isBefore(adminStart, 'day') || userEnd.isAfter(adminEnd, 'day')) {
      return res.status(400).json({ 
        error: "Las fechas seleccionadas están fuera del periodo habilitado" 
      });
    }

    // 3. Obtener todas las reservas existentes para esta estancia
    const [reservasExistentes] = await sequelize.query(
      `SELECT fecha_inicio, fecha_fin FROM mascota_estancia WHERE id_estancia = ?`,
      { replacements: [id_estancia] }
    );

    // 4. Comprobación día a día
    let diaActual = userStart;
    while (diaActual.isSameOrBefore(userEnd, 'day')) {
      let ocupacionDia = 0;

      for (const reserva of reservasExistentes) {
        const resInicio = dayjs(reserva.fecha_inicio);
        const resFin = dayjs(reserva.fecha_fin);

        if (diaActual.isBetween(resInicio, resFin, 'day', '[]')) {
          ocupacionDia++;
        }
      }

      if (ocupacionDia >= cupoMaximo) {
        return res.status(409).json({ 
          error: `No hay cupo disponible para el día ${diaActual.format('DD/MM/YYYY')}` 
        });
      }

      diaActual = diaActual.add(1, 'day');
    }

    // 5. Si todos los días tienen cupo, insertamos la reserva
    const newStayPet = await StayClient.create({
      id_estancia,
      id_mascota,
      fecha_inicio,
      fecha_fin,
      lista_espera: req.body.lista_espera ?? false,
    });

    logger.info(`Reserva de estancia creada para mascota ${id_mascota} del ${fecha_inicio} al ${fecha_fin}`);

    res.status(201).json({
      message: "Relación creada correctamente",
      data: newStayPet,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || (error.original && error.original.code === 'ER_DUP_ENTRY')) {
      return res.status(409).json({ error: "Esta mascota ya tiene una reserva en esta estancia para estas fechas." });
    }
    logger.error("Error al crear la relación de estancia y cliente:", error);
    res.status(500).json({ error: "Error al procesar la reserva" });
  }
});

// Obtener todas las relaciones de estancia y mascota (con info de mascota y cliente)
router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        me.*,
        m.nombre AS nombre_mascota,
        c.nombre AS nombre_cliente
      FROM mascota_estancia me
      JOIN mascota m ON me.id_mascota = m.id
      JOIN cliente c ON m.id_cliente = c.id
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener las relaciones:', error);
    res.status(500).json({ error: 'Error al obtener las relaciones de estancia y mascota' });
  }
});

// Eliminar una relación de estancia y mascota
router.delete('/', async (req, res) => {
  const { id_estancia, id_mascota } = req.body;

  if (!id_estancia || !id_mascota) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const deleted = await StayClient.destroy({
      where: {
        id_estancia,
        id_mascota
      }
    });

    if (deleted) {
      console.log(`Estancia ID ${id_estancia}: Relación eliminada.`);
      res.status(200).json({ message: 'Relación eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró la relación' });
    }
  } catch (error) {
    console.error('Error al eliminar la relación:', error);
    res.status(500).json({ error: 'Error al eliminar la relación de estancia y mascota' });
  }
});

// Obtener todas las relaciones de estancia y mascota (con info de mascota y cliente)
router.get('/all', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        me.*,
        m.nombre AS nombre_mascota,
        c.nombre AS nombre_cliente
      FROM mascota_estancia me
      JOIN mascota m ON me.id_mascota = m.id
      JOIN cliente c ON m.id_cliente = c.id
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener las relaciones:', error);
    res.status(500).json({ error: 'Error al obtener las relaciones de estancia y mascota' });
  }
});

// Actualizar una relación de estancia y mascota
router.put("/edit-stay-client-reservation", async (req, res) => {
  const { id_estancia, id_mascota, nueva_id_estancia, nueva_id_mascota, fecha_inicio, fecha_fin, lista_espera } = req.body;

  console.log("Datos recibidos para editar relación:", {
    id_estancia,
    id_mascota,
    nueva_id_estancia,
    nueva_id_mascota,
    fecha_inicio,
    fecha_fin,
    lista_espera
  });

  // Validar que se envían los identificadores originales
  if (!id_estancia || !id_mascota) {
    return res.status(400).json({ error: "Datos incompletos: se requieren id_estancia e id_mascota" });
  }

  const transaction = await sequelize.transaction();

  try {
    // Verificar que la relación exista
    const [relacion] = await sequelize.query(
      `SELECT * FROM mascota_estancia WHERE id_estancia = ? AND id_mascota = ?;`,
      { replacements: [id_estancia, id_mascota], transaction }
    );

    if (!relacion.length) {
      throw new Error("Relación estancia-mascota no encontrada");
    }

    // Si la relación existe, actualizarla
    await sequelize.query(
      `UPDATE mascota_estancia
       SET 
         id_estancia = ?, 
         id_mascota = ?, 
         fecha_inicio = ?,
         fecha_fin = ?,
         lista_espera = ?
       WHERE id_estancia = ? AND id_mascota = ?;`,
      {
        replacements: [
          nueva_id_estancia ?? id_estancia,
          nueva_id_mascota ?? id_mascota,
          fecha_inicio ?? relacion[0].fecha_inicio,
          fecha_fin ?? relacion[0].fecha_fin,
          lista_espera ?? relacion[0].lista_espera,
          id_estancia,
          id_mascota
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

// Obtener estancias por nombre de cliente (incluyendo info de mascota)
router.get("/client/:nombre", async (req, res) => {
  const { nombre } = req.params;
  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        me.id_estancia,
        me.id_mascota,
        me.fecha_inicio,
        me.fecha_fin,
        me.lista_espera,
        m.nombre AS nombre_mascota,
        e.cupo
      FROM mascota_estancia me
      JOIN mascota m ON me.id_mascota = m.id
      JOIN cliente c ON m.id_cliente = c.id
      JOIN estancia e ON me.id_estancia = e.id
      WHERE c.nombre = ?
      ORDER BY me.fecha_inicio ASC;
    `,
      { replacements: [nombre] }
    );
    res.status(200).json(results);
  } catch (error) {
    logger.error(`Error al obtener estancias para el cliente ${nombre}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Obtener una relación de estancia y mascota por ID de la estancia y el id de la mascota
router.get('/:id_estancia/:id_mascota', async (req, res) => {
  const { id_estancia, id_mascota } = req.params;

  try {
    const stayPet = await StayClient.findOne({
      where: {
        id_estancia,
        id_mascota
      }
    });

    if (!stayPet) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }

    res.status(200).json(stayPet);
  } catch (error) {
    console.error('Error al obtener la relación:', error);
    res.status(500).json({ error: 'Error al obtener la relación de estancia y mascota' });
  }
});

export default router;