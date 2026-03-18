
import Shapeicon from "./Shapeicons"
import Drawingapp from "./Drawing"
import DrawingTool from "./DrawingTool"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import TextTool from "./text"
const Canvas = () => {
    const { toggle, penTool } = useSelector(store => store.canvasTools);

    return (
        <div className="relative">
            <Drawingapp />
            <div className="absolute left-100 top-0 -mt-19">
                <DrawingTool />
            </div>

            {
                toggle && (
                    <div className="absolute left-2 top-20 ">
                        <Shapeicon />
                    </div>
                )
            }
        </div>
    )

}
export default Canvas
