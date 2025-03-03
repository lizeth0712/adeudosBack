const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");

const router = express.Router();

// ✅ Registrar persona
router.post("/", async (req, res) => {
    try {
        const { nombre, cantidad, fecha } = req.body;
        const nuevaPersona = await Persona.create({ nombre, cantidad, fecha });
        res.json(nuevaPersona);
    } catch (error) {
        console.error("Error al registrar persona:", error);
        res.status(500).json({ error: "Error al registrar persona" });
    }
});

// ✅ Obtener todas las personas
router.get("/", async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.json(personas);
    } catch (error) {
        console.error("Error al obtener personas:", error);
        res.status(500).json({ error: "Error al obtener personas" });
    }
});

// ✅ Modificar cantidad de dinero de una persona y registrar el cambio
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion } = req.body;

    try {
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // ✅ Guardar la modificación en la tabla de historial
        await Modificacion.create({
            personaId: id,
            cantidad,
            accion,
            fecha: new Date()
        });

        // ✅ Actualizar la cantidad de la persona
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        res.json({ mensaje: "Cantidad modificada", persona });
    } catch (error) {
        console.error("Error al modificar persona:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

// ✅ Obtener historial de modificaciones de una persona
router.get("/:id/modificaciones", async (req, res) => {
    const { id } = req.params;

    try {
        const modificaciones = await Modificacion.findAll({
            where: { personaId: id },
            order: [["fecha", "DESC"]] // Ordenado por fecha más reciente
        });

        res.json(modificaciones);
    } catch (error) {
        console.error("Error al obtener historial de modificaciones:", error);
        res.status(500).json({ error: "Error al obtener historial de modificaciones" });
    }
});

module.exports = router;
