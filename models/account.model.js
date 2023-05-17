module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define('account', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, 
    {
        timestamps: false,
        initialAutoIncrement: 1
    });
    return Account;
}