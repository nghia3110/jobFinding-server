const { Sequelize, DataTypes} = require("sequelize");
const dbConfig = require("../configs/db.config");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        port: dbConfig.PORT
    }
);

const users = require("./user.model")(sequelize, DataTypes);
const companies = require("./company.model")(sequelize, DataTypes);
const jobs = require("./job.model")(sequelize, DataTypes);
const cv = require('./cv.model')(sequelize, DataTypes);
const accounts = require('./account.model')(sequelize, DataTypes);
const applications = require('./application.model')(sequelize, DataTypes);
const categories = require('./category.model')(sequelize, DataTypes);

companies.hasMany(jobs);
users.hasOne(accounts);
companies.hasOne(accounts);
users.hasMany(cv);
users.hasMany(applications);
jobs.hasMany(applications);
jobs.belongsTo(categories);

const db = {
    users,
    companies,
    jobs,
    cv,
    accounts,
    applications,
    categories
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;