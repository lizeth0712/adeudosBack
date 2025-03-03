require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express .json());

// Importar rutas
const personaRoutes = require("./routes/personas");
app.use("/api/personas", personaRoutes);

// Sincronizar la base de datos
db.sync()
    .then(() => console.log("Base de datos sincronizada"))
    .catch((error) => console.error("Error al sincronizar:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
