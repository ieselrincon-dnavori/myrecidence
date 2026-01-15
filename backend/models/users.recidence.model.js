// models/users.recidence.model.js

module.exports = (sequelize, DataTypes) => {
    const UserRecidence = sequelize.define('user_recidence', { 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // ❌ ELIMINA ESTO: medical_assistant: { type: DataTypes.STRING }
        // ✅ AÑADE ESTO (La clave foránea real):
        medicalAssistantId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'medical_assistants', // nombre de la tabla destino
                key: 'id'
            }
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return UserRecidence;
};