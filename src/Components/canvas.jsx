import Shapeicon from "./Shapeicons"
import Drawingapp from "./Drawing"
import DrawingTool from "./DrawingTool"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { setCurrboard, setScene } from "../Utils/user"
import axios from "axios"
import { BASE_URL } from "../Utils/constant"

const Canvas = () => {
    const { toggle } = useSelector(store => store.canvasTools);
    const currboard = useSelector(store => store.user.currboard);
    const dispatch = useDispatch();
    const { boardId } = useParams(); // ← read from URL

    useEffect(() => {
        if (boardId && boardId !== currboard) {
            const loadBoard = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/getBoards/${boardId}`, { withCredentials: true });
                    dispatch(setScene(res?.data?.scene?.elements));
                    dispatch(setCurrboard(boardId));
                } catch (error) {
                    console.log(error);
                }
            };
            loadBoard();
        }
    }, [boardId]);

    return (
        <div className="relative">
            <Drawingapp />
            <div className="absolute left-125 top-0 -mt-19">
                <DrawingTool />
            </div>
            {toggle && (
                <div className="absolute left-2 top-20">
                    <Shapeicon />
                </div>
            )}
        </div>
    )
}
export default Canvas