const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion"); // Sigue llamándose "Modificacion" en el código
const router = express.Router();

// ✅ Modificar cantidad y guardar en historial
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion, fecha } = req.body;

    try {
        // Buscar la persona por ID
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // Guardar en la tabla "historial"
        await Modificacion.create({
            nombre: persona.nombre, // Guardamos el nombre de la persona
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

// ✅ Obtener historial de modificaciones por nombre
router.get("/historial/:nombre", async (req, res) => {
    const { nombre } = req.params;

    try {
        const modificaciones = await Modificacion.findAll({
            where: { nombre },
            order: [["fecha", "DESC"]] // Ordenar por fecha descendente (más reciente primero)
        });

        res.json(modificaciones);
    } catch (error) {
        console.error("❌ Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

module.exports = router;
