
const connectToServer = (boardId) => {

    const websocket = new WebSocket(`ws://localhost:5000?boardId=${boardId}`);
    return websocket;
}

export { connectToServer }