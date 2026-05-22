const WS_URL = location.hostname === "localhost"
  ? "ws://localhost:5000"
  : "wss://brilliant-wonder-production-63d3.up.railway.app";

const connectToServer = (boardId) => {

    const websocket = new WebSocket(`${WS_URL}?boardId=${boardId}`);
    return websocket;
}

export { connectToServer }