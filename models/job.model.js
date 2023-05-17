module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define('job', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        job_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false
        },
        salaryFrom: {
            type: Sequelize.INTEGER,
        },
        salaryTo: {
            type: Sequelize.INTEGER,
        },
        jobType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        numberNeeded: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        position: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        job_requirement: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        job_benefit: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, 
    {
        initialAutoIncrement: 1
    });
    return Job;
}