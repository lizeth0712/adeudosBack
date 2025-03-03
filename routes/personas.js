const express = require("express");
const Persona = require("../models/Persona");
const Modificacion = require("../models/Modificacion");
const router = express.Router();

// ✅ Modificar cantidad y guardar en "historial"
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, accion, fecha } = req.body; // 📌 Ahora recibimos el nombre directamente

    try {
        console.log("🔄 Intentando modificar:", { id, nombre, cantidad, accion, fecha });

        // ✅ Guardar en la tabla "historial" usando los valores del formulario
        await Modificacion.create({
            id,
            nombre, // 📌 Tomamos el nombre del formulario
            tipo: accion, // "agregar" o "quitar"
            cantidad,
            fecha
        });

        console.log("✅ Modificación guardada en historial");

        // ✅ Ahora sí modificamos la persona en la tabla "personas"
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" });

        persona.cantidad = accion === "agregar" ? persona.cantidad + cantidad : persona.cantidad - cantidad;
        await persona.save();

        console.log("✅ Cantidad actualizada en personas:", persona.cantidad);

        res.json({ mensaje: "Cantidad modificada y guardada en historial", persona });
    } catch (error) {
        console.error("❌ Error al modificar:", error);
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
