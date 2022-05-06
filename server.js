const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const profileRoute = require("./routes/profile");
const verdictRoute = require("./routes/verdict");
const authRoute = require("./routes/auth");
const mainRoute = require("./routes/main");

const app = express();

// app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
    extented: true
}));

// dotenv.config({
    // path:'./config/config.env'
// });

connectDB();

app.use("/", mainRoute);
app.use("/authentication", authRoute);
app.use("/verdict", verdictRoute);
app.use("/user", profileRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, 
    console.log(`Server running on  Port :${PORT}`.magenta.underline.bold));