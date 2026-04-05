const WebSocket = require("ws");

const initializeServer = (httpServer) => {
    const wss = new WebSocket.Server({ server: httpServer });

    let clients = new Set();

    wss.on("connection", (ws, req) => {
        console.log("New Connection");

        clients.add(ws);

        ws.on("close", () => {
            console.log("Closed");
            clients.delete(ws);
        });

        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message.toString());

                const { userId, newElement } = data;

                console.log("newElement:", newElement);

                // broadcast to others
                clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            userId,
                            newElement
                        }));
                    }
                });

            } catch (err) {
                console.error("Invalid JSON:", message.toString());
            }
        });
    });
};

module.exports = { initializeServer };