import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinBox() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleJoin = () => {
        if (!input) return;

        let roomId = input;

        // If user pasted full link → extract roomId
        if (input.includes("/room/")) {
            const parts = input.split("/room/");
            roomId = parts[1];
        }

        //navigate(`/room/${roomId}`);
    };

    return (
        <div className="flex flex-col p-3 bg-white rounded-lg shadow-md w-[400px] h-40">
            <span className="ml-2 mb-3 text-2xl">Paste The Link Below</span>
            <input
                type="text"
                placeholder="Paste link or room ID..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm  "
            />


            <button
                onClick={handleJoin}
                className="px-3 py-1  bg-green-600 text-white rounded hover:bg-green-700 transition mt-4 h-9"
            >
                Join
            </button>

        </div>
    );


}
