const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();

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

// ✅ Modificar cantidad y actualizar en "personas"
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { cantidad, accion, fecha } = req.body; 

    try {
        console.log("🔄 Modificando persona:", { id, cantidad, accion, fecha });

        // ✅ Buscar la persona en la tabla "personas"
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        // ✅ Actualizar la cantidad en la tabla "personas"
        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        console.log("✅ Cantidad actualizada en personas:", persona.cantidad);
        res.json({ mensaje: "Cantidad modificada", persona });
    } catch (error) {
        console.error("❌ Error al modificar persona:", error);
        res.status(500).json({ error: "Error al modificar persona" });
    }
});

// ✅ Guardar historial de modificaciones en "historial"
router.post("/historial", async (req, res) => {
    const { nombre, tipo, cantidad, fecha } = req.body;

    try {
        console.log("📤 Guardando en historial:", { nombre, tipo, cantidad, fecha });

        await Modificacion.create({ nombre, tipo, cantidad, fecha });

        console.log("✅ Modificación guardada en historial");
        res.json({ mensaje: "Historial guardado con éxito" });
    } catch (error) {
        console.error("❌ Error al guardar en historial:", error);
        res.status(500).json({ error: "Error al guardar historial" });
    }
});

// ✅ Obtener historial por nombre
router.get("/historial/:nombre", async (req, res) => {
    const { nombre } = req.params;
    
    try {
        console.log(`🔍 Buscando historial de: ${nombre}`);
        const modificaciones = await Modificacion.findAll({
            where: { nombre },
            order: [["fecha", "DESC"]]
        });

        console.log("📜 Historial encontrado:", modificaciones);
        res.json(modificaciones);
    } catch (error) {
        console.error("❌ Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

module.exports = router;
