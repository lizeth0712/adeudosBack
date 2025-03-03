const { DataTypes } = require("sequelize");
const db = require("../db");

const Modificacion = db.define("historial", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {  // Agregar o Quitar
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {  // Cantidad de la modificación
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cantidad_actual: {  // 🔥 Nueva columna: Cantidad actual después de la modificación
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

module.exports = Modificacion;
