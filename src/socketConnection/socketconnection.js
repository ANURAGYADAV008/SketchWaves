import { io } from "socket.io-client";

let socket = null;

export const connectionWithSocketServer = () => {
  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("connected to Socket.io Server");
  });

};

export const emitElementUpdate = (elementData) => {
  if (!socket) return;
  socket.emit("element-update", elementData);
};

export const listenElementUpdate = (callback) => {
  if (!socket) return;
  socket.on("element-update", callback);
};


export const removeElementListener = () => {
  if (!socket) return;
  socket.off("element-update");
};
