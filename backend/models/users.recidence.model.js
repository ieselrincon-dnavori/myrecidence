// models/users.recidence.model.js

module.exports = (sequelize, DataTypes) => {
    // El nombre de la tabla en la DB será 'user_recidences' por defecto (pluralizado)
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
        medical_assistant: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // 🚨 IMPORTANTE: Añadir el campo 'photo' que está usando en el controlador
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return UserRecidence;
};