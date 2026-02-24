// app.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config"; // Lee variables del archivo .env si lo usas

// Conexión a DB (Sequelize, etc.)
import "./server/db.js";

// Rutas sin Multer
import adminRouter from "./server/routes/admin.js";
import clientRouter from "./server/routes/client.js";
import petRouter from "./server/routes/pet.js";
import classRouter from "./server/routes/class.js";
import classClientRouter from "./server/routes/class_client.js";
import stayRouter from "./server/routes/stay.js";
import stayClient from "./server/routes/stay_client.js";

// Ruta de fotos con Multer
import photosRouter from "./server/routes/photos.js";

// Manejo de __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.NODE_PORT || 3001;

// 1) CORS
app.use(cors());

// 2) Body-parser de Express
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 3) Rutas "normales"
app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);
app.use("/api/pet", petRouter);
app.use("/api/class", classRouter);
app.use("/api/class_client", classClientRouter);
app.use("/api/stay", stayRouter);
app.use("/api/stay_client", stayClient);

// 4) Servir la carpeta "uploads" de forma estática
//    Así podrás acceder en el navegador a /uploads/<archivo> 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5) Rutas con subida de archivos
app.use("/api/photos", photosRouter);

// 6) Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
