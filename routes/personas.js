const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();

// ✅ Modificar cantidad y guardar en "historial"
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion } = req.body;
    const fecha = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    try {
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // ✅ Guardar en la tabla "historial"
        await Modificacion.create({
            nombre: persona.nombre, // Se guarda el nombre de la persona
            tipo: accion, // "agregar" o "quitar"
            cantidad,
            fecha
        });

        // ✅ Actualizar la cantidad en la tabla "personas"
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        res.json({ mensaje: "Cantidad modificada y guardada en historial", persona });
    } catch (error) {
        console.error("❌ Error al modificar:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

module.exports = router;
