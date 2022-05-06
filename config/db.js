const mongoose = require("mongoose");

module.exports= async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold.underline);
}