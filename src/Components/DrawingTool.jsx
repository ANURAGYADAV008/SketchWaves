import {
  PenTool,
  Eraser,
  Shapes,
  Type,
  Undo,
  Redo,
  CircleDot,
  Circle,
  RectangleHorizontal,
  Triangle, Diamond, ArrowRight,
  Download,
  ArrowRightToLine, MousePointerClick,
  Save
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";

const DrawingTool = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-5 bg-white p-2 mt-20 border rounded-md ml-1">

      <PenTool size={20} className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("pen"))}

      />

      <ArrowRightToLine size={20} className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("line"))}

      />

      <MousePointerClick size={20} className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("selection"))}

      />


      <Shapes
        size={20}
        className="mt-3 cursor-pointer"
        onClick={() => dispatch(setToggle())}
      />

      <Type size={20} className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("text"))}
      />

      {/* Shape Tools */}
      <Circle
        size={20}
        className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("circle"))}
      />

      <RectangleHorizontal
        size={20}
        className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("rectangle"))}
      />

      <Triangle
        size={20}
        className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("triangle"))}
      />


      <Diamond
        size={20}
        className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool("polygon"))}
      />


      <input
        type="color"
        onChange={(e) => dispatch(setColor(e.target.value))}
        className="h-7 w-7 mt-2 border rounded-md cursor-pointer"
      />

      <Eraser size={20} className="mt-3 cursor-pointer" />

      <Undo size={20} className="mt-3 cursor-pointer"
        onClick={(e) => dispatch(setTool("undo"))}

      />
      <Redo size={20} className="mt-3 cursor-pointer" onClick={(e) => dispatch(setTool('redo'))} />

      <Download size={20} className="mt-3 cursor-pointer"
        onClick={() => dispatch(setTool('download'))}

      />

    </div>
  );
};

export default DrawingTool;
