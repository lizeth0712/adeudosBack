const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();
const cors = require("cors");

app.use(cors({
    origin: "*", // 🔥 Asegúrate de que la URL es la correcta
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));
// ✅ Obtener todas las personas
router.get("/", async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.json(personas);
    } catch (error) {
        console.error("❌ Error al obtener personas:", error);
        res.status(500).json({ error: "Error al obtener personas" });
    }
});

// ✅ Modificar cantidad y actualizar en "personas" y "historial"
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion, fecha } = req.body; // 🔥 Ahora también recibimos la fecha

    try {
        console.log("🔄 Modificando persona:", { id, cantidad, accion, fecha });

        // ✅ Buscar la persona en la tabla "personas"
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // ✅ Calcular la nueva cantidad después de la modificación
        const nuevaCantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;

        // ✅ Guardar la modificación en la tabla "historial"
        await Modificacion.create({
            nombre: persona.nombre, // 🔥 Usamos el nombre de la tabla personas
            tipo: accion, 
            cantidad, 
            cantidad_actual: nuevaCantidad, // 🔥 Guardamos la cantidad final
            fecha
        });

        console.log("✅ Modificación guardada en historial");

        // ✅ Actualizar la cantidad en la tabla "personas"
        persona.cantidad = nuevaCantidad;
        await persona.save();

        console.log("✅ Cantidad actualizada en personas:", persona.cantidad);
        res.json({ mensaje: "Cantidad modificada y guardada en historial", persona });
    } catch (error) {
        console.error("❌ Error al modificar persona:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

// ✅ Obtener historial por nombre
router.get("/historial/:nombre", async (req, res) => {
    const { nombre } = req.params;
    
    try {
        console.log(`🔍 Buscando historial de: ${nombre}`);
        const modificaciones = await Modificacion.findAll({
            where: { nombre },
            order: [["fecha", "DESC"]] // Ordenar de más reciente a más antiguo
        });

        console.log("📜 Historial encontrado:", modificaciones);
        res.json(modificaciones);
    } catch (error) {
        console.error("❌ Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

module.exports = router;
