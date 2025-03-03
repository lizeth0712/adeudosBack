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

// ✅ Modificar cantidad de dinero y guardar en historial
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion, fecha } = req.body;

    try {
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // ✅ Guardar en la tabla de Modificaciones
        await Modificacion.create({
            nombre: persona.nombre,
            tipo: accion,
            cantidad,
            fecha
        });

        // ✅ Actualizar el saldo de la persona
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        res.json({ mensaje: "Cantidad modificada", persona });
    } catch (error) {
        console.error("Error al modificar persona:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

// ✅ Obtener historial de modificaciones por nombre de cliente
router.get("/historial/:nombre", async (req, res) => {
    const { nombre } = req.params;

    try {
        const modificaciones = await Modificacion.findAll({
            where: { nombre },
            order: [["fecha", "DESC"]]
        });

        res.json(modificaciones);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

module.exports = router;
