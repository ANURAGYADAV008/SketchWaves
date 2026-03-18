require("dotenv").config();
const db = process.env.DB_URL;


const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(db);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { connectDb }