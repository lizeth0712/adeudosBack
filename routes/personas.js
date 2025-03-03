const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();

// ✅ Modificar cantidad y guardar historial
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion, fecha } = req.body;

    try {
        // Buscar la persona por ID
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // Guardar la modificación en la tabla "modificacion"
        await Modificacion.create({
            nombre: persona.nombre, // Guardamos el nombre
            tipo: accion, // "agregar" o "quitar"
            cantidad,
            fecha
        });

        // Actualizar la cantidad en la tabla "personas"
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        res.json({ mensaje: "Cantidad modificada y guardada en historial", persona });
    } catch (error) {
        console.error("❌ Error al modificar persona y guardar historial:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

module.exports = router;
