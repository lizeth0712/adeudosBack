require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Configuración CORS para permitir solicitudes solo desde tu frontend
app.use(cors({
    origin: "https://lizeth0712.github.io/adeudosFront/", // Asegúrate de cambiarlo por tu URL real de GitHub Pages
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());

// Importar rutas
const personaRoutes = require("./routes/personas");
app.use("/api/personas", personaRoutes);

// Sincronizar la base de datos
db.sync()
    .then(() => console.log("Base de datos sincronizada"))
    .catch((error) => console.error("Error al sincronizar:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
