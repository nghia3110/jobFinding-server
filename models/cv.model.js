module.exports = (sequelize, Sequelize) => {
    const CV = sequelize.define('cv', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        file: {
            type: Sequelize.BLOB('long'),
            allowNull: false
        }
    }, 
    {
        initialAutoIncrement: 1
    });
    return CV;
}