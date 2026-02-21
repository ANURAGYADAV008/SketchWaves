import { configureStore } from "@reduxjs/toolkit";
import canvasToolsReducer from "./Tool";

const appStore = configureStore({
  reducer: {
    canvasTools: canvasToolsReducer,
  },
});

export default appStore;
