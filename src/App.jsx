import Shapeicon from "./Components/Shapeicons"
import Drawingapp from "./Components/Drawing"
import DrawingTool from "./Components/DrawingTool"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { connectionWithSocketServer } from "./socketConnection/socketconnection"
import TextTool from "./Components/text"

const App = () => {
  const {toggle,penTool }= useSelector(store => store.canvasTools);

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



export default App
