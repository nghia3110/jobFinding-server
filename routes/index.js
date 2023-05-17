const userRouter = require('./user.route');
const jobRouter = require('./job.route');
const companyRouter = require('./company.route');
const cvRouter = require('./cv.route');
const authRouter = require('./auth.route');
const uploadRouter = require('./uploadFile.route');

function route(app) {
    app.use('/api/user', userRouter);
    app.use('/api/job', jobRouter);
    app.use('/api/company', companyRouter );
    app.use('/api/cv', cvRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/upload', uploadRouter);
}

module.exports = route;