const express = require("express");
const Persona = require("../models/Persona");
const router = express.Router();

// Registrar persona
router.post("/", async (req, res) => {
    try {
        const { nombre, cantidad, fecha } = req.body;
        const nuevaPersona = await Persona.create({ nombre, cantidad, fecha });
        res.json(nuevaPersona);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar persona" });
    }
});

// Obtener todas las personas
router.get("/", async (req, res) => {
    const personas = await Persona.findAll();
    res.json(personas);
});

// Modificar cantidad de dinero
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion } = req.body;

    try {
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        if (accion === "agregar") {
            persona.cantidad += cantidad;
        } else if (accion === "quitar") {
            persona.cantidad -= cantidad;
        }

        await persona.save();
        res.json(persona);
    } catch (error) {
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

module.exports = router;
