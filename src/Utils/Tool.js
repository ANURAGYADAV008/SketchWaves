import { createSlice } from "@reduxjs/toolkit";

const canvasToolsSlice = createSlice({
  name: "canvasTools",
  initialState: {
    tool: "line",
    color: "#ff0000",
    thickness: 1,
    toggle: true,
    background: "transparent",
    fillStyle: "",
    strokeWidth: 1,
    strokeLineDash: [],
    "penTool":false
  },
  reducers: {
    setTool: (state, action) => {
      state.tool = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setThickness: (state, action) => {
      state.thickness = action.payload;
    },
    setToggle: (state) => {
      state.toggle = !state.toggle;
    },
    setBackground: (state, action) => {
      state.background = action.payload;
    },
    setFillStyle: (state, action) => {
      state.fillStyle = action.payload;
    },
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload;
    },
    setStrokeLineDash: (state, action) => {
      state.strokeLineDash = action.payload;
    },
    setPenTool:(state)=>{
      state.penTool=!state.penTool;
    }
  },
});

export const {
  setTool,
  setColor,
  setThickness,
  setToggle,
  setBackground,
  setFillStyle,
  setStrokeWidth,
  setStrokeLineDash,
  setPenTool
} = canvasToolsSlice.actions;

export default canvasToolsSlice.reducer;
