const { DataTypes } = require("sequelize");
const db = require("../db");

const Modificacion = db.define("historial", { // 🔥 La tabla en BD se llamará "historial"
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING, // "agregar" o "quitar"
        allowNull: false
    },
    cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY, // Solo guarda la fecha, sin la hora
        allowNull: false
    }
}, {
    timestamps: false, // 🔥 Evita que Sequelize agregue createdAt y updatedAt
    tableName: "historial" // 🔥 Esto le dice a Sequelize que la tabla en BD se llame "historial"
});

module.exports = Modificacion;
