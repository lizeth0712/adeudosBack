require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const Persona = require("./models/Persona");
const Modificacion = require("./models/Modificacion");

const app = express();

// ✅ Configuración CORS para permitir solicitudes solo desde tu frontend en GitHub Pages
app.use(cors({
    origin: "https://lizeth0712.github.io/adeudosFront", // Asegúrate de que esta URL es la correcta
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());

// ✅ Importar rutas
const personaRoutes = require("./routes/personas");
app.use("/api/personas", personaRoutes);

// ✅ Sincronizar la base de datos
db.sync({ alter: true }) // ⚡ Esto asegurará que las tablas se creen si no existen
    .then(() => console.log("✅ Base de datos sincronizada correctamente"))
    .catch((error) => console.error("❌ Error al sincronizar la base de datos:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
