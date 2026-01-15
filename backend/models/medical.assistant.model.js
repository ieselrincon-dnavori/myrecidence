module.exports = (sequelize, DataTypes) => {
    const MedicalAssistant = sequelize.define('medical_assistant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return MedicalAssistant;
};