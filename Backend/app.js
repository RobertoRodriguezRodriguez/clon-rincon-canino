// app.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import "./server/db.js";

import adminRouter from "./server/routes/admin.js";
import clientRouter from "./server/routes/client.js";
import petRouter from "./server/routes/pet.js";
import classRouter from "./server/routes/class.js";
import classClientRouter from "./server/routes/class_client.js";
import stayRouter from "./server/routes/stay.js";
import stayClient from "./server/routes/stay_client.js";
import photosRouter from "./server/routes/photos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.NODE_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);
app.use("/api/pet", petRouter);
app.use("/api/class", classRouter);
app.use("/api/class_client", classClientRouter);
app.use("/api/stay", stayRouter);
app.use("/api/stay_client", stayClient);
app.use("/api/photos", photosRouter);

// ⚠️ Vercel no soporta archivos estáticos persistentes
// La carpeta uploads NO funcionará en Vercel
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Solo escucha en local, no en producción
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// ✅ Exportar para Vercel
export default app;