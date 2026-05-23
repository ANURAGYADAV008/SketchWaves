import React, { use, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";
import getStroke from "perfect-freehand";

import useCreateElement from '../hooks/useCreteElement';
import { connectToServer } from '../Utils/serverConnection';
import axios from 'axios';
import { BASE_URL } from '../Utils/constant';
const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.repeat) return;

      setPressedKeys(prevKeys => {
        const updated = new Set(prevKeys);
        updated.add(event.key.toLowerCase());
        return updated;
      });
    };

    const handleKeyUp = event => {
      setPressedKeys(prevKeys => {
        const updated = new Set(prevKeys);
        updated.delete(event.key.toLowerCase());
        return updated;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};

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
  const [panoffset, setPanoffset] = useState({ x: 0, y: 0 });
  const [startPanning, setStartPanning] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleoffset, setScaleoffset] = useState({x:0,y:0});
  const pressedKeys = usePressedKeys()



  const textAreaRef = useRef(null);


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
        `${BASE_URL}/savescene/${currboard}`,
        { elements: cleanElements },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      handledbFunction(currboard);
    }, 2000);

    return () => clearTimeout(timer);
  }, [elements])


  useEffect(() => {
    if (!currboard) return;
    console.log("EFFECT RUN", currboard);


    const webSocket = connectToServer(currboard); // <-- pass boardId
    socketRef.current = webSocket;

    webSocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const { type, element, elements: remoteEls } = msg;

        if (type === "ELEMENT_UPDATE" && element) {
          // Merge by id+version — last-write-wins
          setElements((prev) => {
            const map = new Map(prev.map((el) => [el.id, el]));
            const existing = map.get(element.id);
            if (!existing || (element.version ?? 0) >= (existing.version ?? 0)) {
              map.set(element.id, element);
            }
            return Array.from(map.values());
          });
        }

        if (type === "CURSOR_UPDATE") {
          // You can render remote cursors here later
        }
      } catch (err) {
        console.error("Invalid WS message:", event.data);
      }
    };

    webSocket.onopen = () => console.log("WS connected to board:", currboard);
    webSocket.onclose = () => console.log("WS closed");

    return () => webSocket.close();
  }, [currboard]);



  const getMousePos = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - panoffset.x*scale+scaleoffset.x)/scale,
      y: (event.clientY - rect.top - panoffset.y*scale+scaleoffset.y)/scale
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



  useEffect(() => {
    const panfunction = (event) => {
      const isZooming =
        pressedKeys.has("control") ||
        pressedKeys.has("meta");

      if (isZooming) {
        event.preventDefault();

        onZoom(event.deltaY * -0.01);
        return;
      }

      if (tool !== "panning") return;

      setPanoffset((prev) => ({
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
    };

    document.addEventListener("wheel", panfunction, { passive: false });

    return () => {
      document.removeEventListener("wheel", panfunction);
    };
  }, [tool, pressedKeys]);


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


  const startDrawing = (event) => {
    const { x, y } = getMousePos(event);

    if (event.button === 1) {
      setAction("panning");
      setStartPanning({ x: x, y: y });
      return;
    }

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

      if (action === "panning") {
        const deltax = clientX - startPanning.x;
        const deltay = clientY - startPanning.y;
        setPanoffset((prev) => ({
          x: prev.x + deltax,
          y: prev.y
        }))

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
    if (newElement) {
      const stamped = { ...newElement, version: Date.now() };
      // Update local state with version too
      setElements((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = stamped;
        return copy;
      });
      sendElement(stamped);
    }
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

  const sendElement = (element) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;


    const stamped = { ...element, version: Date.now() };

    ws.send(JSON.stringify({
      type: "ELEMENT_UPDATE",
      element: stamped,
    }));
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


  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rc = rough.canvas(canvas);

    const scaleWidth=canvas.width*scale
    const scaleHeight=canvas.height*scale;
    const scaleOffsetX=(scaleWidth-canvas.width)/2;
    const scaleOffsetY=(scaleHeight-canvas.height)/2;
    setScaleoffset({x:scaleOffsetX,y:scaleOffsetY});

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.save()

    ctx.translate(panoffset.x*scale-scaleOffsetX, panoffset.y*scale-scaleOffsetY)
     ctx.scale(scale,scale);

    elements.forEach((element) => {
      // Skip the active text element — the textarea renders it live
      if (action === "writing" && selectedElement && element.id === selectedElement.id) return;
      if (action === 'panning') return;

      if (element.type === "text") {
        ctx.textBaseline = "top";
        ctx.font = "20px/1.2 cursive";
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
      else if (element.type === "panning") return;
      else {
        rc.draw(element.roughEle);
      }
    });

    ctx.restore();
  }, [elements, action, selectedElement, panoffset,scale]);

  const onZoom = (delta) => {
    setScale(prevState => Math.min(Math.max(prevState + delta,0.1),20));

  }
  return (
    <div>
      {/* Textarea only appears while the user is actively typing */}
      {action === "writing" && selectedElement && (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: (selectedElement.y1)*scale + panoffset.y*scale-scaleoffset.y,
            left: (selectedElement.x1)*scale + panoffset.x*scale-scaleoffset.x,
            font: `${20*scale}px/1.2 cursive}`,       // must match ctx.font exactly
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
            lineHeight: 1,
            height: "auto"
          }}
          rows={1}
        />
      )}
      <div
  style={{
    position: "fixed",
    bottom: 20,
    left:"50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
     backdropFilter: "blur(10px)",
    borderRadius: "18px",
    zIndex: 20,
  }}
>
  <div
    className="flex items-center gap-2 px-2 py-2 rounded-2xl 
    bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
  >
    <button
      onClick={() => onZoom(-0.1)}
      className="w-9 h-5 flex items-center justify-center 
      rounded-xl bg-neutral-800 text-white text-1xl 
      hover:bg-neutral-700 active:scale-95 transition-all"
    >
      -
    </button>

    <span
      onClick={() => setScale(1)}
      className="min-w-[70px] text-center  font-semibold 
      cursor-pointer select-none"
    >
      {new Intl.NumberFormat("en-GB", {
        style: "percent",
      }).format(scale)}
    </span>

    <button
      onClick={() => onZoom(0.1)}
      className="w-8 h-5 flex items-center justify-center 
      rounded-xl bg-neutral-800 text-white text-1xl 
      hover:bg-neutral-700 active:scale-95 transition-all"
    >
      +
    </button>
  </div>
</div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className={`bg-[#f8f8ef]
      bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]
      bg-size-[30px_30px] ${tool === "panning" ? "cursor-grab" : "cursor-crosshair"}`}
        style={{ backgroundPosition: `${panoffset.x}px ${panoffset.y}px` }}
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





