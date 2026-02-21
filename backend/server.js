import express from "express";
import cors from "cors";
import http from "http";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";

configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔥 Store all drawn elements (in-memory)
let elements = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  
  for(let i=0;i<elements.length;i++){
    socket.emit("whiteboard-state", elements);
  }

  // 2️⃣ Receive new element from a user
  socket.on("element-update", (element) => {
    elements.push(element); // store it

    // 3️⃣ Broadcast to all OTHER users
    socket.broadcast.emit("element-update", element);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send({ message: "Hello from server" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
