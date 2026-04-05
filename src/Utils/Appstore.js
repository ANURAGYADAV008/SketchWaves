import { configureStore } from "@reduxjs/toolkit";
import canvasToolsReducer from "./Tool";
import userSliceReducer from "./user"

const appStore = configureStore({
  reducer: {
    canvasTools: canvasToolsReducer,
    user: userSliceReducer
  },
});

export default appStore;
