const express = require('express');
const db = require('./models/index');
const route = require('./routes/index');
const cors = require('cors');
const os = require('os');
const dotenv = require('dotenv');
const port = 8000;

const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


route(app);

/* async function connectDB() {
  await db.jobs.sync({ alter: true });
  console.log("Jobs models were synchronized successfully.");
}

connectDB(); */


app.listen(port, () => console.log(`App is running on ${port}`));