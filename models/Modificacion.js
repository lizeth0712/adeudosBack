const { DataTypes } = require("sequelize");
const db = require("../db");
const Persona = require(".Persona");

const Modificacion = db.define("Modificacion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    personaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Persona,
            key: "id"
        }
    },
    cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Modificacion;
