import { Diamond, ArrowRightFromLine, Star } from "lucide-react";
import ShareBtn from "./button";
import { useDispatch } from "react-redux";
import {
  setTool,
  setColor,
  setThickness,
  setToggle,
  setBackground,
  setFillStyle,
  setStrokeWidth,
  setStrokeLineDash,
} from "../Utils/Tool";
import Thickness from "./Thickness";

const Shapeicon = () => {
  const dispatch = useDispatch();
  const roomId = crypto.randomUUID();

  return (
    <div className="bg-white p-3 space-y-3 border rounded-md">
      {/* Stroke Color */}
      <div className="text-sm font-medium">Stroke</div>
      <div className="flex gap-2">
        <div
          className="h-7 w-7 bg-amber-500 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setColor("#f59e0b"))}
        />
        <div
          className="h-7 w-7 bg-red-600 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setColor("#dc2626"))}
        />
        <div
          className="h-7 w-7 bg-green-600 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setColor("#16a34a"))}
        />
        <div
          className="h-7 w-7 bg-blue-600 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setColor("#2563eb"))}
        />
        <div
          className="h-7 w-7 bg-orange-600 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setColor("#ea580c"))}
        />
      </div>

      {/* Background Color */}
      <div className="text-sm font-medium">Background</div>
      <div className="flex gap-2">
        <div
          className="h-7 w-7 bg-pink-100 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setBackground("#fce7f3"))}
        />
        <div
          className="h-7 w-7 bg-green-100 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setBackground("#dcfce7"))}
        />
        <div
          className="h-7 w-7 bg-yellow-100 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setBackground("#fef9c3"))}
        />
        <div
          className="h-7 w-7 bg-blue-100 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setBackground("#dbeafe"))}
        />
        <div
          className="h-7 w-7 bg-fuchsia-100 border rounded cursor-pointer hover:ring-2"
          onClick={() => dispatch(setBackground("#fae8ff"))}
        />
      </div>

      {/* Fill Style */}
      <div className="text-sm font-medium">Fill</div>
      <div className="flex gap-2">
        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100 bg-black"
          onClick={() => dispatch(setFillStyle("solid"))}>

        </div>


        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setFillStyle("hachure"))}>
          <p className="p-">////</p>
        </div>

        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setFillStyle("zigzag"))}
        >
          <p className="ml-0.5">||||||
          </p>
        </div>
      </div>

      {/* Stroke Width */}
      <div className="text-sm font-medium">Stroke width</div>
      <div className="flex gap-2">
        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeWidth(.5))}
        >
          <p className="p-1  -mt-2 text-1xl">→</p>
          <p className="p-1  -mt-7 text-1xl">→</p>

        </div>
        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeWidth(3))}

        >

          <p className="p- -mt-2 text-2xl">→</p>
        </div>
        <div
          className="h-7 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeWidth(5))}
        >
          <p className="p-0.5 -mt-3  text-3xl font-extrabold ">→</p>
        </div>
      </div>

      {/* Stroke Line Dash */}
      <div className="text-sm font-medium">Stroke Line</div>
      <div className="flex gap-2">
        <div
          className="h-6 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeLineDash([]))}
        >
          <p className="p-0 -mt-2 text-2xl">→</p>
        </div>
        <div
          className="h-6 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeLineDash([5, 5]))}
        >
          <p className="p-1 -mt-4 text-2xl">...</p>
        </div>
        <div
          className="h-6 w-7 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setStrokeLineDash([10, 20]))}
        >

          <p className="p-1  -mt-4  text-2xl">....</p>
        </div>
      </div>

      {/* Capacity / Thickness */}
      <div className="text-sm font-medium">Collaborate</div>
      <ShareBtn roomId={roomId} />
    </div>
  );
};

export default Shapeicon;
