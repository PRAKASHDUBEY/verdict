const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();

//Logger
app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
    extented: true
}));


dotenv.config({
    path:'./config/config.env'
});


connectDB();

app.use('/api/todo/auth', require('./routes/user'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  Port :${PORT}`.magenta.underline.bold));
