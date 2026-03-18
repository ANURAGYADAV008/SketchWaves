import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setColor, setPenTool, setToggle, setTool } from "../Utils/Tool";
import getStroke from "perfect-freehand";
import useCreateElement from '../hooks/useCreteElement';

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

  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [selectedElement, setSelectedElement] = useState(null);

  const canvasRef = useRef(null);

  // -----------------------------
  // Convert mouse to canvas coords
  // -----------------------------
  const getMousePos = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // -----------------------------
  // Hit Detection
  // -----------------------------
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

  // -----------------------------
  // Mouse Down
  // -----------------------------
  const startDrawing = (event) => {
    const { x, y } = getMousePos(event);

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
        type   // ← pass the element's own type so createElement uses it, not "selection"
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
    setAction("none");
    setSelectedElement(null);
  };

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
      const updatedElements = [...elements];
      updatedElements.pop();
      setElements(updatedElements);
      dispatch(setTool(null));
    }

    if (tool === "selection") {
      setAction("selection");
    }
  }, [tool]);

  // useEffect(() => {
  //   connectionWithSocketServer();

  //   listenElementUpdate((element) => {
  //     setElements((prev) => [...prev, element]);
  //   });

  //   return () => {
  //     removeElementListener();
  //   };
  // }, []);

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
      if (element.type === "text") {
        ctx.font = "48px serif";
        ctx.fillText(element.text, element.x1, element.y1);
      }

      else if (element.type === "pen") {
        const stroke = getSvgPathFromStroke(getStroke(element.points, {
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
        ctx.fillStyle = element.color;
        ctx.fill(new Path2D(stroke));
      }

      else {
        rc.draw(element.roughEle);
      }
    });
  }, [elements]);

  console.log("Yes Rendering")

  // -----------------------------
  // Render
  // -----------------------------
  return (
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
  );
};

export default Drawingapp;

