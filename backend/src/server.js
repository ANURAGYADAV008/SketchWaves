const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectDb } = require("./configuration/db")
const http = require("http")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const { authRouter } = require("./routes/userRoute");
app.use("/", authRouter);
const server = http.createServer(app);
connectDb()
  .then(() => {
    console.log("Data Base Connection established ...");
    server.listen(PORT, () => {
      console.log(`Server Start Listen at ${PORT}`)

    })
  }).catch((error) => {
    console.log(error.message)
  })


