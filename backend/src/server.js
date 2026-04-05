const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectDb } = require("./configuration/db")
const http = require("http")
const { initializeServer } = require("./utils/websocket")
const { authRouter } = require("./routes/userRoute")
const { boardRouter } = require("./routes/boardRoute")


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/", authRouter);
app.use("/", boardRouter);


const httpServer = http.createServer(app);
initializeServer(httpServer);


connectDb()
  .then(() => {
    console.log("Data Base Connection established ...");
    httpServer.listen(PORT, () => {
      console.log(`Server Start Listen at ${PORT}`)

    })
  }).catch((error) => {
    console.log(error.message)
  })


