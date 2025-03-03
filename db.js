require("dotenv").config(); // Carga el archivo .env

const { Sequelize } = require("sequelize");
console.log("📌 DATABASE_URL desde .env:", process.env.DATABASE_URL);

// Asegúrate de que DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: La variable DATABASE_URL no está definida en .env");
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

sequelize.authenticate()
    .then(() => console.log("✅ Conectado a PostgreSQL en Railway"))
    .catch(err => console.error("❌ Error al conectar:", err));

module.exports = sequelize;
