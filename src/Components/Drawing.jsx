// import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
// import rough from 'roughjs/bundled/rough.esm';
// import { useSelector } from 'react-redux';
// import { useDispatch } from "react-redux";
// import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";
// import getStroke from "perfect-freehand";

// import useCreateElement from '../hooks/useCreteElement';
// import { connectToServer } from '../Utils/serverConnection';
// import axios from 'axios';
// const Drawingapp = () => {
//   const dispatch = useDispatch();
//   const {
//     tool,
//     color,
//     background,
//     fillStyle,
//     strokeWidth,
//     strokeLineDash
//   } = useSelector((store) => store.canvasTools);

//   const { createElement } = useCreateElement(
//     tool,
//     color,
//     background,
//     fillStyle,
//     strokeWidth,
//     strokeLineDash
//   );

//   const scene = useSelector((store) => store.user.scene) || [];
//   const currboard = useSelector(store => store.user.currboard);
//   const [elements, setElements] = useState(scene);
//   const [action, setAction] = useState("none");
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, value: "" });
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (scene && scene.length > 0 && elements.length === 0) {
//       setElements(scene);
//     }
//   }, [scene]);

//   const canvasRef = useRef(null);
//   const socketRef = useRef(null);

//   const handledbFunction = async (currboard) => {
//     try {
//       const cleanElements = elements.map(({ path, ...rest }) => rest);
//       console.log(elements)
//       const res = await axios.put(
//         `http://localhost:5000/saveScene/${currboard}`,
//         { elements: cleanElements },
//         {
//           withCredentials: true
//         }
//       );


//     }
//     catch (error) {
//       console.log(error)
//     }


//   }

//   useEffect(() => {
//     if (!currboard) return;

//     const timer = setTimeout(() => {
//       handledbFunction(currboard);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, [elements, currboard]);


//   const getMousePos = (event) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     return {
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top
//     };
//   };


//   const isWithElement = (x, y, element) => {
//     const { x1, y1, x2, y2, type } = element;

//     if (type === "rectangle" || type === "polygone" || type === "triangle" || type == "rectangle") {
//       const minX = Math.min(x1, x2);
//       const maxX = Math.max(x1, x2);
//       const minY = Math.min(y1, y2);
//       const maxY = Math.max(y1, y2);
//       return x >= minX && x <= maxX && y >= minY && y <= maxY;
//     }

//     if (type === "circle") {
//       const radius = Math.hypot(x2 - x1, y2 - y1);
//       return Math.hypot(x - x1, y - y1) <= radius;
//     }

//     if (type === "line") {
//       const a = y2 - y1;
//       const b = x1 - x2;
//       const c = x2 * y1 - x1 * y2;
//       const distance = Math.abs(a * x + b * y + c) / Math.hypot(a, b);
//       return distance < 5;
//     }

//     if (type === "text") {
//       return Math.abs(x - x1) < 100 && Math.abs(y - y1) < 30;
//     }

//     return false;
//   };

//   const getSelectedElement = (x, y, elements) => {
//     return [...elements]
//       .reverse()
//       .find((element) => isWithElement(x, y, element));
//   };

//   // -----------------------------
//   // Mouse Down
//   // -----------------------------
//   const startDrawing = (event) => {
//     const { x, y } = getMousePos(event);

//     if (action === "writing") return;

//     if (tool === "text") {
//       setAction("writing");
//       setSelectedElement(newElement);
//     }

//     if (tool === "selection") {
//       const element = getSelectedElement(x, y, elements);
//       if (element) {
//         const offsetX = x - element.x1;
//         const offsetY = y - element.y1;
//         setSelectedElement({ ...element, offsetX, offsetY });
//         setAction("moving");
//       }
//       return;
//     }

//     setAction("drawing");
//     const id = elements.length;
//     const newElement = createElement(x, y, x, y, id);
//     setElements((prev) => [...prev, newElement]);

//   };

//   // -----------------------------
//   // Mouse Move
//   // -----------------------------
//   const draw = (event) => {
//     const { x, y } = getMousePos(event);

//     if (action === "drawing") {
//       const index = elements.length - 1;
//       const element = elements[index];

//       if (tool === "pen") {
//         const updated = {
//           ...element,
//           points: [...element.points, [x, y]]
//         };
//         const copy = [...elements];
//         copy[index] = updated;
//         setElements(copy);
//         return;
//       }

//       const { x1, y1 } = element;
//       const updated = createElement(x1, y1, x, y, index);


//       const copy = [...elements];
//       copy[index] = updated;
//       setElements(copy);



//     }

//     else if (action === "moving" && selectedElement) {
//       const { id, type, offsetX, offsetY } = selectedElement;

//       if (type === "pen") {
//         const dx = x - offsetX - selectedElement.x1;
//         const dy = y - offsetY - selectedElement.y1;

//         const updatedPoints = elements[id].points.map(([px, py]) => [
//           px + dx,
//           py + dy
//         ]);

//         const updated = {
//           ...elements[id],
//           points: updatedPoints
//         };

//         const copy = [...elements];
//         copy[id] = updated;
//         setElements(copy);
//         return;
//       }

//       const { x1, y1, x2, y2 } = elements[id];
//       const width = x2 - x1;
//       const height = y2 - y1;

//       const newX1 = x - offsetX;
//       const newY1 = y - offsetY;

//       const updated = createElement(
//         newX1,
//         newY1,
//         newX1 + width,
//         newY1 + height,
//         id,
//         type   // ← pass the element's own type so createElement uses it, not "selection"
//       );

//       const copy = [...elements];
//       copy[id] = updated;
//       setElements(copy);
//     }
//   };

//   // -----------------------------
//   // Mouse Up
//   // -----------------------------
//   const finishDrawing = () => {
//     setAction("none");
//     setSelectedElement(null);
//     let x = elements.length
//     const newElement = elements[x - 1];
//     sendElement(newElement);
//   };

//   useEffect(() => {
//     if (tool === 'download') {
//       const canvas = document.getElementById('canvas');
//       let data = canvas.toDataURL("image/png")
//       const aEl = document.createElement("a");
//       aEl.href = data;
//       aEl.download = "sketchwaves.png"
//       aEl.click();
//     }

//     if (tool === 'undo') {
//       if (elements.length === 0) { dispatch(setTool(null)); return; }
//       const updatedElements = [...elements];
//       updatedElements.pop();
//       setElements(updatedElements);
//       dispatch(setTool(null));
//     }

//     if (tool === 'savetodb') {
//       handledbFunction();
//       dispatch(setTool('null'));
//     }

//     if (tool === "selection") {
//       setAction("selection");
//     }
//   }, [tool]);

//   useEffect(() => {
//     const webSocket = connectToServer();
//     socketRef.current = webSocket;

//     webSocket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         const { userId, newElement } = data;

//         console.log("Received:", newElement);

//         if (newElement) {
//           setElements((prev) => [...prev, newElement]);
//         }
//       } catch (err) {
//         console.error("Invalid message:", event.data);
//       }
//     };

//     webSocket.onopen = () => {
//       console.log("Connected");
//     };

//     webSocket.onclose = () => {
//       console.log("Closed !!");
//     };

//     return () => {
//       webSocket.close();
//     };
//   }, []);

//   const sendElement = (newElement) => {
//     const ws = socketRef.current;
//     const data = { userId: "1234", newElement: newElement };
//     ws.send(JSON.stringify(data));

//   }

//   const getSvgPathFromStroke = stroke => {
//     if (!stroke.length) return "";

//     const d = stroke.reduce(
//       (acc, [x0, y0], i, arr) => {
//         const [x1, y1] = arr[(i + 1) % arr.length];
//         acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
//         return acc;
//       },
//       ["M", ...stroke[0], "Q"]
//     );

//     d.push("Z");
//     return d.join(" ");
//   };

//   const commitText = () => {
//     if (!textInput.value.trim()) {
//       setTextInput({ visible: false, x: 0, y: 0, value: "" });
//       return;
//     }

//     const id = elements.length;
//     const newElement = {
//       id,
//       type: "text",
//       x1: textInput.x,
//       y1: textInput.y,
//       x2: textInput.x,
//       y2: textInput.y,
//       text: textInput.value,
//       color,
//     };

//     setElements((prev) => [...prev, newElement]);
//     sendElement(newElement);
//     setTextInput({ visible: false, x: 0, y: 0, value: "" });
//   };

//   const handleTextKeyDown = (e) => {
//     return
//   };


//   // -----------------------------
//   // Canvas Rendering
//   // -----------------------------
//   useLayoutEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const rc = rough.canvas(canvas);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     elements.forEach((element) => {
//       console.log(element);
//       if (element.type === "text") {
//         ctx.font = "30px cursive";
//         ctx.fillStyle = element.color || "black"; // ← was missing
//         ctx.fillText(element.text, element.x1, element.y1);
//       }
//       else if (element.type === "pen") {
//         const stroke = getSvgPathFromStroke(getStroke(element.points, {
//           size: 3,           // thin base width
//           thinning: 0.5,     // high — thins a lot when writing fast
//           smoothing: 0.5,
//           streamline: 0.5,   // low — follows path tightly, less lag
//           simulatePressure: true,
//           last: true,
//           start: {
//             cap: true,        // no flat cap — let it taper to a point
//             taper: 0,         // sharp pointed tip at stroke start
//             easing: (t) => t * (2 - t)  // easeInCubic — very needle-sharp
//           },
//           end: {
//             cap: true,        // no flat cap — let it taper to a point
//             taper: 0,         // sharp pointed tail at stroke end
//             easing: (t) => t * (2 - t), // easeInCubic — very needle-sharp
//           },
//         }));
//         ctx.fillStyle = element.color;
//         ctx.fill(new Path2D(stroke));
//       }

//       else {
//         rc.draw(element.roughEle);
//       }
//     });
//   }, [elements]);

//   console.log("Yes Rendering")

//   // -----------------------------
//   // Render
//   // -----------------------------
//   return (
//     <div>
//       {textInput.visible && (
//         <textarea
//           ref={textareaRef}
//           style={{
//             position: "fixed",
//             top: textInput.y,   // offset so cursor aligns with canvas baseline
//             left: textInput.x,
//             background: "transparent",
//             border: "none",
//             outline: "none",
//             font: "30px cursive",      // must match ctx.font exactly
//             color: color,
//             resize: "none",
//             overflow: "hidden",
//             minWidth: "4px",
//             lineHeight: 1,
//             zIndex: 10,
//           }}
//           value={textInput.value}
//           onChange={(e) => setTextInput((p) => ({ ...p, value: e.target.value }))}
//           onBlur={commitText}
//           onKeyDown={handleTextKeyDown}
//           rows={1}
//         />
//       )}
//       <canvas
//         ref={canvasRef}
//         id="canvas"
//         className="bg-white cursor-crosshair"
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseUp={finishDrawing}
//       />
//     </div>
//   );
// };

// export default Drawingapp;

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";
import getStroke from "perfect-freehand";

import useCreateElement from '../hooks/useCreteElement';
import { connectToServer } from '../Utils/serverConnection';
import axios from 'axios';

const Drawingapp = () => {
  const dispatch = useDispatch();
  const {
    tool,
    color,
    background,
    fillStyle,
    strokeWidth,
    strokeLineDash
  } = useSelector((store) => store.canvasTools);

  const { createElement } = useCreateElement(
    tool,
    color,
    background,
    fillStyle,
    strokeWidth,
    strokeLineDash
  );

  const scene = useSelector((store) => store.user.scene) || [];
  const currboard = useSelector(store => store.user.currboard);
  const [elements, setElements] = useState(scene);
  const [action, setAction] = useState("none");
  const [selectedElement, setSelectedElement] = useState(null);
  const [redoElements, setRedoElemets] = useState([]);

  // ── Text ref ─────────────────────────────────────────────────────────────────
  const textAreaRef = useRef(null);
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (scene && scene.length > 0 && elements.length === 0) {
      setElements(scene);
    }
  }, [scene]);

  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  const handledbFunction = async (currboard) => {
    try {
      const cleanElements = elements.map(({ path, ...rest }) => rest);
      const res = await axios.put(
        `http://localhost:5000/saveScene/${currboard}`,
        { elements: cleanElements },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currboard) return;
    const timer = setTimeout(() => {
      handledbFunction(currboard);
    }, 1500);
    return () => clearTimeout(timer);
  }, [elements, currboard]);

  const getMousePos = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const isWithElement = (x, y, element) => {
    const { x1, y1, x2, y2, type } = element;

    if (type === "rectangle" || type === "polygone" || type === "triangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }

    if (type === "circle") {
      const radius = Math.hypot(x2 - x1, y2 - y1);
      return Math.hypot(x - x1, y - y1) <= radius;
    }

    if (type === "line") {
      const a = y2 - y1;
      const b = x1 - x2;
      const c = x2 * y1 - x1 * y2;
      const distance = Math.abs(a * x + b * y + c) / Math.hypot(a, b);
      return distance < 5;
    }

    if (type === "text") {
      return Math.abs(x - x1) < 100 && Math.abs(y - y1) < 30;
    }

    return false;
  };

  const getSelectedElement = (x, y, elements) => {
    return [...elements]
      .reverse()
      .find((element) => isWithElement(x, y, element));
  };

  useEffect(() => {
    if (action === "writing" && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.focus();
        textAreaRef.current.value = selectedElement?.text || "";
      }, 0);
    }
  }, [action, selectedElement]);
  // ─────────────────────────────────────────────────────────────────────────────

  // ── Commit text on blur (click away or Tab) ───────────────────────────────
  const handleBlur = (event) => {
    if (!selectedElement) return;
    const { id, x1, y1 } = selectedElement;
    const text = event.target.value;

    if (!text.trim()) {
      // Remove the empty placeholder element
      setElements((prev) => prev.filter((_, i) => i !== id));
      setAction("none");
      setSelectedElement(null);
      return;
    }

    // Measure final text width so selection/hit-testing works correctly
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "30px cursive";
    const textWidth = ctx.measureText(text).width;
    const textHeight = 30;

    const committed = {
      id,
      type: "text",
      x1,
      y1,
      x2: x1 + textWidth,
      y2: y1 + textHeight,
      text,
      color,
    };

    setElements((prev) => {
      const copy = [...prev];
      copy[id] = committed;
      return copy;
    });

    sendElement(committed);
    setAction("none");
    setSelectedElement(null);
  };
  // ─────────────────────────────────────────────────────────────────────────────

  // -----------------------------
  // Mouse Down
  // -----------------------------
  const startDrawing = (event) => {
    const { x, y } = getMousePos(event);

    // While typing, ignore all canvas clicks
    if (action === "writing") return;

    if (tool === "text") {
      // 1. Reserve a slot in the elements array so id is stable
      const id = elements.length;
      const newElement = {
        id,
        type: "text",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        text: "",
        color,
      };
      setElements((prev) => [...prev, newElement]);
      // 2. Enter writing mode — textarea will appear & auto-focus via useEffect
      setSelectedElement(newElement);
      setAction("writing");
      return;
    }

    if (tool === "selection") {
      const element = getSelectedElement(x, y, elements);
      if (element) {
        const offsetX = x - element.x1;
        const offsetY = y - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setAction("moving");
      }
      return;
    }

    setAction("drawing");
    const id = elements.length;
    const newElement = createElement(x, y, x, y, id);
    setElements((prev) => [...prev, newElement]);
  };

  // -----------------------------
  // Mouse Move
  // -----------------------------
  const draw = (event) => {
    if (action === "writing") return;

    const { x, y } = getMousePos(event);

    if (action === "drawing") {
      const index = elements.length - 1;
      const element = elements[index];

      if (tool === "pen") {
        const updated = {
          ...element,
          points: [...element.points, [x, y]]
        };
        const copy = [...elements];
        copy[index] = updated;
        setElements(copy);
        return;
      }

      const { x1, y1 } = element;
      const updated = createElement(x1, y1, x, y, index);
      const copy = [...elements];
      copy[index] = updated;
      setElements(copy);
    }

    else if (action === "moving" && selectedElement) {
      const { id, type, offsetX, offsetY } = selectedElement;

      if (type === "pen") {
        const dx = x - offsetX - selectedElement.x1;
        const dy = y - offsetY - selectedElement.y1;

        const updatedPoints = elements[id].points.map(([px, py]) => [
          px + dx,
          py + dy
        ]);

        const updated = {
          ...elements[id],
          points: updatedPoints
        };

        const copy = [...elements];
        copy[id] = updated;
        setElements(copy);
        return;
      }

      const { x1, y1, x2, y2 } = elements[id];
      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = x - offsetX;
      const newY1 = y - offsetY;

      const updated = createElement(
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        id,
        type
      );

      const copy = [...elements];
      copy[id] = updated;
      setElements(copy);
    }
  };

  // -----------------------------
  // Mouse Up
  // -----------------------------
  const finishDrawing = () => {
    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
    const newElement = elements[elements.length - 1];
    sendElement(newElement);
  };

  useEffect(() => {
    if (tool === 'download') {
      const canvas = document.getElementById('canvas');
      let data = canvas.toDataURL("image/png");
      const aEl = document.createElement("a");
      aEl.href = data;
      aEl.download = "sketchwaves.png";
      aEl.click();
    }

    if (tool === 'undo') {
      if (elements.length === 0) { dispatch(setTool(null)); return; }
      const updatedElements = [...elements];
      const lastelement = elements[elements.length - 1]
      setRedoElemets((prev) => [...prev, lastelement])

      updatedElements.pop();
      setElements(updatedElements);
      dispatch(setTool(null));
    }
    else if (tool === 'redo') {
      if (redoElements.length === 0) { dispatch(setTool(null)); return; }
      const lastelement = redoElements[redoElements.length - 1];
      setElements((prev) => [...prev, lastelement]);
      redoElements.pop();
      dispatch(setTool(null));

    }
    if (tool === 'savetodb') {
      handledbFunction();
      dispatch(setTool('null'));
    }

    if (tool === "selection") {
      setAction("selection");
    }
  }, [tool]);

  useEffect(() => {
    const webSocket = connectToServer();
    socketRef.current = webSocket;

    webSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { userId, newElement } = data;
        if (newElement) {
          setElements((prev) => [...prev, newElement]);
        }
      } catch (err) {
        console.error("Invalid message:", event.data);
      }
    };

    webSocket.onopen = () => console.log("Connected");
    webSocket.onclose = () => console.log("Closed !!");

    return () => webSocket.close();
  }, []);

  const sendElement = (newElement) => {
    const ws = socketRef.current;
    const data = { userId: "1234", newElement: newElement };
    ws.send(JSON.stringify(data));
  };

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

  // -----------------------------
  // Canvas Rendering
  // -----------------------------
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rc = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      // Skip the active text element — the textarea renders it live
      if (action === "writing" && selectedElement && element.id === selectedElement.id) return;

      if (element.type === "text") {
        ctx.textBaseline = "top";       // ← critical: aligns with textarea top edge
        ctx.font = "30px cursive";      // ← must match textarea font exactly
        ctx.fillStyle = element.color || "black";
        ctx.fillText(element.text, element.x1, element.y1);
      }

      else if (element.type === "pen") {
        const stroke = getSvgPathFromStroke(getStroke(element.points, {
          size: 3,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
          simulatePressure: true,
          last: true,
          start: {
            cap: true,
            taper: 0,
            easing: (t) => t * (2 - t)
          },
          end: {
            cap: true,
            taper: 0,
            easing: (t) => t * (2 - t),
          },
        }));
        ctx.fillStyle = element.color;
        ctx.fill(new Path2D(stroke));
      }

      else {
        rc.draw(element.roughEle);
      }
    });
  }, [elements, action, selectedElement]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div>
      {/* Textarea only appears while the user is actively typing */}
      {action === "writing" && selectedElement && (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.y1,    // matches ctx.textBaseline = "top"
            left: selectedElement.x1,
            font: "30px cursive",       // must match ctx.font exactly
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            color: color,
            zIndex: 10,
            minWidth: "2px",
            lineHeight: 1,
          }}
          rows={1}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="bg-white cursor-crosshair"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
      />
    </div>
  );
};

export default Drawingapp;





