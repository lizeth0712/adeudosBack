const { DataTypes } = require("sequelize");
const db = require("../db");

const Modificacion = db.define("Modificacion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        type: DataTypes.DATE, // Solo guarda la fecha (sin hora)
        allowNull: false
    }
});

module.exports = Modificacion;
