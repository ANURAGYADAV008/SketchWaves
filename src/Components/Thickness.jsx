import { useDispatch } from "react-redux"
import { setThickness } from "../Utils/Tool";
import { useRef, useState } from "react";

const Thickness=()=>{
    const [capacity,setCapacity]=useState(0);
    const dispatch=useDispatch();
    return(
        <div>
            <input  onChange={(e)=>{dispatch(setThickness(e.target.value))
              setCapacity(e.target.value)

            }}className="rounded-full appearance-non cursor-pointer" type="range" min="1" max="5">
            </input>
            <h3 className="font font-mono font-bold">{capacity}</h3>
        </div>
    )
}
export default Thickness