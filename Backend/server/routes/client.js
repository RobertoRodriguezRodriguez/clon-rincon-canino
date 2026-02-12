import { sha1 } from "js-sha1";
import express from "express";
import jwt from "jsonwebtoken";
import sequelize from "../db.js";
import { logger } from "../logger.js";

import Client from "../../models/client.js";
import Admin from "../../models/admin.js";

export const JWT_SECRET = "mysecretkey";
const router = express.Router();

// Iniciar sesión
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const client = await Client.findOne({
    where: {
      email: email,
      password: sha1(password),
    },
  });

  if (!client) {
    logger.error("Usuario o contraseña incorrectos");
    res.json({ error: "Usuario o contraseña incorrectos" });
    return;
  }

  if (!client.activo) {
    logger.error("Usuario inactivo");
    res.json({ error: "Usuario inactivo" });
    return;
  }

  const token = jwt.sign({ id: client.id, email: client.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  logger.info(`Cliente ${client.email} logged in`);
  res.json({ token });
});

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    logger.error("Token no proporcionado");
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, JWT_SECRET, (error, usuario) => {
    if (error) {
      logger.error("Token inválido");
      return res.status(403).json({ mensaje: "Token inválido" });
    }

    req.body.usuario = usuario;
    next();
  });

  logger.info("Token verificado");
};

// Ruta para obtener el perfil de un usuario
router.get("/", verificarToken, (req, res) => {
  const { usuario } = req.body;

  Client.findOne({
    where: {
      id: usuario.id,
    },
  }).then((client) => {
    Admin.findOne({
      where: {
        email: usuario.email,
      },
    }).then((admin) => {
      if (admin !== null) {
        logger.info(`Perfil de ${admin.email} obtenido - Admin`);
        res.json(admin.dataValues);
      } else {
        logger.info(`Perfil de ${client.email} obtenido - No admin`);
        res.json(client.dataValues);
      }
    });
  });
});

// Crear usuario
router.put("/", async (req, res) => {
  const { nombre, telefono, dni, email, password } = req.body;

  // Validar que los datos necesarios estén presentes
  if (!nombre || !telefono || !dni || !email || !password) {
    logger.error("Faltan datos obligatorios en la solicitud");
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    // Log de datos recibidos
    logger.debug("Datos recibidos para creación de usuario:", {
      nombre,
      telefono,
      dni,
      email,
      password: "***HASHED***", // No loguear contraseñas en texto plano
    });

    // Crear el usuario
    const client = await Client.create({
      nombre: nombre,
      telefono: telefono,
      dni: dni,
      email: email,
      password: sha1(password),
      activo: false,
    });

    // Log de éxito
    logger.info(`Usuario creado: ${client.nombre} - ${client.dni}`);
    res.status(201).json({
      message: "Usuario creado correctamente",
      data: client.dataValues,
    });

  } catch (error) {
    // Manejo y log de errores
    logger.error("Error al crear el usuario:", error);

    // Responder con un mensaje específico para errores de base de datos
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "El email o DNI ya están registrados" });
    }

    res
      .status(500)
      .json({ error: "Error interno al crear el usuario", details: error });
  }
});

// Actualizar usuario
router.put("/update", async (req, res) => {
  const { id, telefono, email } = req.body;
  Client.update(
    {
      telefono: telefono,
      email: email,
    },
    {
      where: {
        id: id,
      },
    }
  ).then((client) => {
    logger.info(`Usuario ${client.nombre} - ${client.dni} actualizado`);
    res.json(client.dataValues);
  });
});

// Eliminar usuario
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  // Validar que se haya proporcionado un ID
  if (!id) {
    logger.error("Falta el ID del usuario en la solicitud");
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  try {
    // Log de datos recibidos
    logger.debug("ID recibido para eliminar el usuario:", { id });

    // Eliminar el usuario
    const client = await Client.destroy({
      where: {
        id: id,
      },
    });

    // Si no se encuentra el usuario
    if (!client) {
      logger.warn(`Usuario no encontrado con ID: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Log de éxito
    logger.info(`Usuario eliminado: ID ${id}`);
    res.status(200).json({
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {
    // Manejo y log de errores
    logger.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error interno al eliminar el usuario", details: error });
  }
});

// Hacer que un usuario sea inactivo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  Client.update(
    {
      activo: false,
    },
    {
      where: {
        id: id,
      },
    }
  ).then((client) => {
    logger.info(`Usuario ${client.nombre} - ${client.dni} inactivo`);
    res.json(client.dataValues);
  });
});

// Hacer que un usuario sea activo
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  Client.update(
    {
      activo: true,
    },
    {
      where: {
        id: id,
      },
    }
  ).then((client) => {
    logger.info(`Usuario ${client.nombre} - ${client.dni} activo`);
    res.json(client.dataValues);
  });
});

// Obtener todos los usuarios
router.get("/all", async (req, res) => {
  Client.findAll().then((clients) => {
    logger.info("Se muestran todos los usuarios");
    res.json(clients);
  });
});

// Obtener info general de los usuarios
// router.get("/info-client", async (req, res) => {
//   const [results, metadata] = await sequelize.query(
//     `select distinct cliente.id as id_cliente, activo, cliente.nombre as nombre_cliente, telefono,
//     mascota.nombre as nombre_mascota, dni, email, mascota.id as id_mascota from cliente
//     inner join mascota on cliente.id = mascota.id_cliente;`
//   );
//   logger.info("Se muestran todos los usuarios con sus mascotas");
//   res.json(results);
// });

router.get("/info-client", async (req, res) => {
  const [results, metadata] = await sequelize.query(
    ` SELECT DISTINCT cliente.id AS id_cliente, 
        activo, 
        cliente.nombre AS nombre_cliente, 
        telefono, 
        mascota.nombre AS nombre_mascota, 
        dni, 
        email, 
        COALESCE(mascota.id, 'No tiene mascota') AS id_mascota 
      FROM cliente 
      LEFT JOIN mascota ON cliente.id = mascota.id_cliente;`
  );
  logger.info("Se muestran todos los usuarios con sus mascotas");
  res.json(results);
});

// Obtener usuario por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  Client.findOne({
    where: {
      id: id,
    },
  }).then((client) => {
    logger.info(`Usuario ${client.nombre} - ${client.dni} obtenido`);
    res.json(client);
  });
});

export default router;