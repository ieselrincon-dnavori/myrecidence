const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    operatorsAliases: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Cargar modelos
try {
    // 🚨 ATENCIÓN CRÍTICA: Asegúrate de que el archivo existe y se llama EXACTAMENTE 'users.recidence.model.js'
    db.userRecidence = require('./users.recidence.model.js')(sequelize, DataTypes);
    db.task = require('./task.model.js')(sequelize, DataTypes); 
} catch (error) {
    console.error("--- 🚨 ERROR CRÍTICO AL CARGAR MODELOS DE SEQUELIZE 🚨 ---");
    console.error("Esto sucede si el nombre de archivo del modelo es incorrecto o si el archivo no existe.");
    console.error("Asegúrate de tener 'users.recidence.model.js' y 'task.model.js' en la carpeta models.");
    console.error("Error original:", error.message);
    console.error("----------------------------------------------------------");
    // Es posible que necesites terminar el proceso si el error persiste, pero por ahora solo avisamos.
}

// Establecer Relaciones (Solo se ejecutarán si los modelos se cargaron)
// Si los modelos no se cargaron, la aplicación fallará aquí.
if (db.userRecidence && db.task) {
    // Un Residente (userRecidence) tiene muchas Tareas (task)
    db.userRecidence.hasMany(db.task, {
        as: "tasks", // Alias para cuando se incluya en las consultas
        foreignKey: 'userRecidenceId', // Nombre de la clave foránea en la tabla 'tasks'
        onDelete: 'CASCADE' // Si eliminas el residente, sus tareas también se eliminan
    });

    // Una Tarea (task) pertenece a un Residente (userRecidence)
    db.task.belongsTo(db.userRecidence, {
        foreignKey: "userRecidenceId",
        as: "userRecidence", // Alias para cuando se incluya en las consultas
    });
}


module.exports = db;