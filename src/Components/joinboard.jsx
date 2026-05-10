import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrboard } from "../Utils/user";
import axios from "axios";
import { setScene } from "../Utils/user";
export default function JoinBox() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleJoin = async () => {
        if (!input.trim()) return;

        let boardId = input.trim();

        if (boardId.includes("/canvas/")) {
            boardId = boardId.split("/canvas/")[1];
        } else if (boardId.includes("/room/")) {
            boardId = boardId.split("/room/")[1];
        }


        boardId = boardId.split("?")[0].split("/")[0];

        if (!boardId) return;

        try {
            const getBoardData = await axios.get(`${BASE_URL}/getBoards/${boardId}`, { withCredentials: true });
            const elements = res?.data?.scene?.elements;
            dispatch(setScene(elements));
        } catch (error) {
            console.log(error)
        }

        dispatch(setCurrboard(boardId));
        navigate(`/canvas/${boardId}`);
    };

    return (
        <div className="flex flex-col p-3 bg-white rounded-lg shadow-md w-[400px] h-40">
            <span className="ml-2 mb-3 text-2xl">Paste The Link Below</span>
            <input
                type="text"
                placeholder="Paste link or board ID..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
                onClick={handleJoin}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition mt-4 h-9"
            >
                Join
            </button>
        </div>
    );
}
