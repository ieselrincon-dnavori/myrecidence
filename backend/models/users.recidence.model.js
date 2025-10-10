module.exports = (sequelize, DataTypes) => {
    const UserRecidence = sequelize.define('user.recidence', {
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
        }
    });
    return UserRecidence;
}