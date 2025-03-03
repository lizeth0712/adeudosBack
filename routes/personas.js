const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();

// ✅ Modificar cantidad y guardar en "historial"
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion } = req.body;
    const fecha = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    try {
        console.log("🔄 Buscando persona con ID:", id);
        const persona = await Persona.findByPk(id);
        if (!persona) {
            console.log("❌ Persona no encontrada");
            return res.status(404).json({ error: "Persona no encontrada" });
        }

        console.log("✅ Persona encontrada:", persona.nombre);

        // ✅ Guardar en la tabla "historial"
        console.log("📤 Guardando modificación en historial...");
        await Modificacion.create({
            nombre: persona.nombre, // Se guarda el nombre de la persona
            tipo: accion, // "agregar" o "quitar"
            cantidad,
            fecha
        });

        console.log("✅ Modificación guardada en historial");

        // ✅ Actualizar la cantidad en la tabla "personas"
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        console.log("✅ Cantidad actualizada en personas:", persona.cantidad);

        res.json({ mensaje: "Cantidad modificada y guardada en historial", persona });
    } catch (error) {
        console.error("❌ Error al modificar:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

module.exports = router;
