
const connectToServer = () => {
    const websocket = new WebSocket("ws://localhost:5000?userId=1");
    return websocket;
}

export { connectToServer }