require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const Persona = require("./models/Persona");
const Modificacion = require("./models/Modificacion");

const app = express();
app.get("/", (req, res) => {
    res.send("✅ Servidor corriendo en Railway correctamente");
});
app.get("/test", (req, res) => {
    res.json({ mensaje: "Ruta de prueba funcionando" });
});


app.use(cors({
    origin: "*",  // 🔥 Permite todas las conexiones (para pruebas)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));


app.use(express.json());

// ✅ Importar rutas
const personaRoutes = require("./routes/personas");
app.use("/api/personas", personaRoutes);


// ✅ Sincronizar la base de datos
db.sync() // ⚡ Sincroniza todas las tablas sin perder datos
    .then(() => {
        console.log("✅ Base de datos sincronizada correctamente");

        // 🔥 Crear la tabla "historial" si no existe (sin afectar otras tablas)
        return Modificacion.sync({ alter: true });
    })
    .then(() => console.log("✅ Tabla 'historial' verificada o creada"))
    .catch((error) => console.error("❌ Error al sincronizar la base de datos:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
