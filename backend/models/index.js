const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- CARGA DE MODELOS EXISTENTES ---

try {
    // 1. Cargar Residentes (Archivo: users.recidence.model.js)
    db.userRecidence = require('./users.recidence.model.js')(sequelize, DataTypes);
    db.medicalAssistant = require('./medical.assistant.model.js')(sequelize, DataTypes);
    console.log("✅ Modelo 'userRecidence' cargado.");

    // 2. Cargar Usuarios Admin (Archivo: adm.user.model.js)
    db.users = require('./adm.user.model.js')(sequelize, DataTypes);

    console.log("✅ Modelo 'users' (Admin) cargado correctamente.");

    db.medicalAssistant.hasMany(db.userRecidence, {
    as: "residents",
    foreignKey: "medicalAssistantId"
});

db.userRecidence.belongsTo(db.medicalAssistant, {
    foreignKey: "medicalAssistantId",
    as: "assistant"
});

} catch (error) {
    console.error("--- 🚨 ERROR CARGANDO MODELOS 🚨 ---");
    console.error("Detalle:", error.message);
}

// Usa esto solo para esta ejecución
db.sequelize.sync().then(() => {
    console.log("✅ Tablas creadas correctamente.");
}).catch(err => {
    console.error("❌ Error sincronizando:", err.message);
});

module.exports = db;