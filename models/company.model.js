module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define('company', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        companyLogo: {
            type: Sequelize.TEXT,
        },
        employees: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, 
    {
        timestamps: false,
        initialAutoIncrement: 1
    });
    return Company;
}