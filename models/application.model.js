module.exports = (sequelize, Sequelize) => {
    const Application = sequelize.define('application', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        cvId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        message: {
            type: Sequelize.TEXT
        }
    }, 
    {
        initialAutoIncrement: 1
    });
    return Application;
}