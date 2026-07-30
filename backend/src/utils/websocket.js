const WebSocket = require("ws");

const initializeServer = (httpServer) => {
    const wss = new WebSocket.Server({ server: httpServer });
    const rooms = new Map();

    wss.on("connection", (ws, req) => {
        try {
            // req.url can be like "/?boardId=abc123"

            const url = new URL(req.url, "http://localhost");
            const boardId = url.searchParams.get("boardId");

            //console.log("WS connection attempt, boardId:", boardId);

            if (!boardId || boardId === "null" || boardId === "undefined") {
                //console.log("No valid boardId, closing connection");
                ws.close();
                return;
            }

            if (!rooms.has(boardId)) rooms.set(boardId, new Set());
            const room = rooms.get(boardId);
            room.add(ws);
            console.log(`Client joined board: ${boardId} | peers: ${room.size}`);

            ws.on("message", (raw) => {
                let msg;
                try { msg = JSON.parse(raw.toString()); } catch { return; }

                for (const peer of room) {
                    if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                        peer.send(JSON.stringify(msg));
                    }
                }
            });

            ws.on("close", () => {
                room.delete(ws);
                if (room.size === 0) rooms.delete(boardId);
                //console.log(`Client left board: ${boardId} | peers: ${room.size}`);
            });

            ws.on("error", (err) => {
                //console.log("WS error:", err.message);
                ws.terminate();
            });

        } catch (err) {
            console.log("WS connection error:", err.message);
            ws.close();
        }
    });
};

module.exports = { initializeServer };