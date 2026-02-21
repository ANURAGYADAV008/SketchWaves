import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";
import getStroke from "perfect-freehand";

import {
  connectionWithSocketServer,
  emitElementUpdate,
  listenElementUpdate,
  removeElementListener,
} from '../socketConnection/socketconnection';


const gen = rough.generator();


function createElement(
  x1, y1, x2, y2,
  tool, color, thickness,
  background, fillStyle,
  strokeWidth, strokeLineDash
) {
  let roughEle = null;

  if (tool === "line") {
    roughEle = gen.line(x1, y1, x2, y2, {
      roughness: 0,
      stroke: color,
      strokeWidth,
      strokeLineDash
    });
  }

  else if (tool === "rectangle") {
    roughEle = gen.rectangle(
      x1,
      y1,
      x2 - x1,
      y2 - y1,
      {
        roughness: 0,
        stroke: color,
        fill: background,
        fillStyle,
        strokeWidth,
        strokeLineDash
      }
    );
  }

  else if (tool === "circle") {
    const r = Math.hypot(x2 - x1, y2 - y1);
    roughEle = gen.circle(x1, y1, r * 2, {
      roughness: 0,
      stroke: color,
      fill: background,
      fillStyle,
      strokeWidth,
      strokeLineDash
    });
  }

  else if (tool === "polygon" || tool === "triangle") {
    const sides = tool === "polygon" ? 4 : 3;
    const r = Math.hypot(x2 - x1, y2 - y1);
    const angleStep = (Math.PI * 2) / sides;
    const initialAngle = -Math.PI / 2;

    const vertices = [];
    for (let i = 0; i < sides; i++) {
      const angle = initialAngle + i * angleStep;
      vertices.push([
        x2 + r * Math.cos(angle),
        y2 + r * Math.sin(angle),
      ]);
    }

    roughEle = gen.polygon(vertices, {
      roughness: 0,
      stroke: color,
      fill: background,
      fillStyle,
      strokeWidth,
      strokeLineDash
    });
  }

  else if (tool === "text") {
    return {
      type: "text",
      x1,
      y1,
      text: "Hello world"
    };
  }
  else if (tool === "pen") {
    return {
      type: "pen",
      x1,
      y1,
      color,
      points: [[x1, y1]]
    }

  }

  return {
    type: "roughjs",
    x1,
    y1,
    x2,
    y2,
    roughEle
  };
}



const Drawingapp = () => {
  const dispatch = useDispatch();
  const {
    tool,
    color,
    thickness,
    background,
    fillStyle,
    strokeWidth,
    strokeLineDash
  } = useSelector((store) => store.canvasTools);



  //   //creating a state of a shape element which is initially empty
  const [elements, setElements] = useState([]);
  //creating a state of drawing which is initially false
  const [undoredoelements, setUndoredoelements] = useState([]);

  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (tool === 'download') {
      const canvas = document.getElementById('canvas');
      let data = canvas.toDataURL("image/png")
      const aEl = document.createElement("a");
      aEl.href = data;
      aEl.download = "sketchwaves.png"
      aEl.click();
    }

    if (tool === 'undo') {
      if (elements.length === 0) { dispatch(setTool(null)); return; }
      const currentElement = elements[elements.length - 1];
      const updatedElements = [...elements];
      updatedElements.pop();
      setElements([...updatedElements]);
      setUndoredoelements(prev => [...prev, currentElement]);
      dispatch(setTool(null));
    }

    if (tool === 'redo') {
      if (undoredoelements.length > 0) {
        const currentElement = undoredoelements[undoredoelements.length - 1];
        setElements(prev => [...prev, currentElement]);
        setUndoredoelements(prev => prev.slice(0, -1));
      }
      dispatch(setTool(null));
    }
  }, [tool]);

  useEffect(() => {
    connectionWithSocketServer();

    listenElementUpdate((element) => {
      setElements((prev) => [...prev, element]);
    });

    return () => {
      removeElementListener();
    };
  }, []);
  const getSvgPathFromStroke = stroke => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  };

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    //clearing the screen everytime it's re-rendered
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rc = rough.canvas(canvas);

    //performs a specified action for each element in the array

    if (elements.length !== 0) {
      elements.forEach((ele) => {
        if (ele.type === "text") {
          ctx.font = "48px serif";
          ctx.fillText(ele.text, ele.x1, ele.y1);
        }
        else if (ele.type === "pen") {
          const stroke = getSvgPathFromStroke(getStroke(ele.points, {
            size: 3,           // thin base width
            thinning: 0.5,     // high — thins a lot when writing fast
            smoothing: 0.5,
            streamline: 0.5,   // low — follows path tightly, less lag
            simulatePressure: true,
            last: true,
            start: {
              cap: true,        // no flat cap — let it taper to a point
              taper: 0,         // sharp pointed tip at stroke start
              easing: (t) => t * (2 - t)  // easeInCubic — very needle-sharp
            },
            end: {
              cap: true,        // no flat cap — let it taper to a point
              taper: 0,         // sharp pointed tail at stroke end
              easing: (t) => t * (2 - t), // easeInCubic — very needle-sharp
            },
          }));
          ctx.fillStyle = ele.color;
          ctx.fill(new Path2D(stroke));
        }
        else {
          rc.draw(ele.roughEle);
        }

      });
    }


  }, [elements]);


  const startDrawing = (event) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const newEle = createElement(clientX, clientY, clientX, clientY, tool, color, thickness, background, fillStyle, strokeWidth, strokeLineDash, elements, setElements);
    setElements((state) => [...state, newEle]); //copying to the previous state
  };
  const finishDrawing = () => {
    setDrawing(false);
    const lastElement = elements[elements.length - 1];
    if (lastElement) {
      emitElementUpdate(lastElement)
    }
  };
  const draw = (event) => {
    if (!drawing) return; //not in a mousedown postion

    const { clientX, clientY } = event;
    const index = elements.length - 1; //last element of the array "elements"

    // Pen tool: accumulate points into the existing element instead of recreating it
    if (tool === "pen") {
      const existingElement = elements[index];
      const updatedPenEle = {
        ...existingElement,
        points: [...existingElement.points, [clientX, clientY]]
      };
      const copyElement = [...elements];
      copyElement[index] = updatedPenEle;
      setElements(copyElement);
      return;
    }

    const { x1, y1 } = elements[index];

    const updatedEle = createElement(x1, y1, clientX, clientY, tool, color, thickness, background, fillStyle, strokeWidth, strokeLineDash, elements, setElements);

    //update the position with the new element instead of the previous one

    const copyElement = [...elements];

    copyElement[index] = updatedEle; //replacing last index
    setElements(copyElement);
  };



  //'bg-[#242525]'
  return (
    <canvas
      ref={canvasRef}
      id='canvas'
      className='bg-white cursor-crosshair'
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
    >
      Canvas
    </canvas>
  );
};
export default Drawingapp;


// import { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";

// const Drawingapp = () => {
//   const { tool, color, thickness } = useSelector(
//     (store) => store.canvasTools
//   );

//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const isDrawingRef = useRef(false);
//   const startPosRef = useRef({ x: 0, y: 0 });
//   const lastPosRef = useRef(null);
//   const snapshotRef = useRef(null);

//   function setupHiDPICanvas(canvas, ctx) {
//     const dpr = window.devicePixelRatio || 1;
//     const rect = canvas.getBoundingClientRect();

//     canvas.width = rect.width * dpr;
//     canvas.height = rect.height * dpr;

//     ctx.scale(dpr, dpr);
//   }

//   function getMousePos(canvas, evt) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: evt.clientX - rect.left,
//       y: evt.clientY - rect.top,
//     };
//   }

//   function startDrawing(e) {
//     const canvas = canvasRef.current;
//     const pos = getMousePos(canvas, e);

//     isDrawingRef.current = true;
//     startPosRef.current = pos;
//     lastPosRef.current = pos;

//     snapshotRef.current = ctxRef.current.getImageData(
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     if (tool === "pen" || tool === "eraser") {
//       ctxRef.current.beginPath();
//       ctxRef.current.moveTo(pos.x, pos.y);
//     }
//   }

//   function draw(e) {
//     if (!isDrawingRef.current) return;

//     const canvas = canvasRef.current;
//     const pos = getMousePos(canvas, e);
//     const ctx = ctxRef.current;

//     ctx.putImageData(snapshotRef.current, 0, 0);

//     if (tool === "pen") {
//       const last = lastPosRef.current;
//       const midX = (last.x + pos.x) / 2;
//       const midY = (last.y + pos.y) / 2;

//       ctx.quadraticCurveTo(last.x, last.y, midX, midY);
//       ctx.stroke();

//       lastPosRef.current = pos;
//     }

//     if (tool === "rectangle") {
//       ctx.strokeRect(
//         startPosRef.current.x,
//         startPosRef.current.y,
//         pos.x - startPosRef.current.x,
//         pos.y - startPosRef.current.y
//       );
//     }

//     if (tool === "circle") {
//       const r = Math.hypot(
//         pos.x - startPosRef.current.x,
//         pos.y - startPosRef.current.y
//       );
//       ctx.beginPath();
//       ctx.arc(startPosRef.current.x, startPosRef.current.y, r, 0, Math.PI * 2);
//       ctx.stroke();
//     }

//     if (tool === "line") {
//       ctx.beginPath();
//       ctx.moveTo(startPosRef.current.x, startPosRef.current.y);
//       ctx.lineTo(pos.x, pos.y);
//       ctx.stroke();
//     }

//     if (tool === "eraser") {
//       ctx.lineTo(pos.x, pos.y);
//       ctx.stroke();
//     }
//   }

//   function stopDrawing() {
//     isDrawingRef.current = false;
//     lastPosRef.current = null;
//   }

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     setupHiDPICanvas(canvas, ctx);

//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     ctx.strokeStyle = color;
//     ctx.lineWidth = thickness;

//     ctx.globalCompositeOperation =
//       tool === "eraser" ? "destination-out" : "source-over";

//     ctxRef.current = ctx;
//   }, []);

//   useEffect(() => {
//     const ctx = ctxRef.current;
//     if (!ctx) return;

//     ctx.strokeStyle = color;
//     ctx.lineWidth = thickness;
//     ctx.globalCompositeOperation =
//       tool === "eraser" ? "destination-out" : "source-over";
//   }, [color, thickness, tool]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="bg-white w-screen h-screen cursor-crosshair"
//       onMouseDown={startDrawing}
//       onMouseMove={draw}
//       onMouseUp={stopDrawing}
//       onMouseLeave={stopDrawing}
//     />
//   );
// };

// export default Drawingapp;


