import { configureStore } from "@reduxjs/toolkit";

import { midiMessageSlice } from "redux/slices/midiMessageSlice";
import { participantSlice } from "redux/slices/participantSlice";
import { sessionSlice } from "redux/slices/sessionSlice";

import { pixiAppSlice } from "redux/slices/pixiAppSlice";

import { composeWithDevTools } from "redux-devtools-extension";
import * as pixi from "pixi.js";

// Create a single instance of the PixiJS renderer
// const MainAppRender = new pixi.Renderer(1920, 1080, {
//   antialias: true,
//   autoResize: true
// });

// const renderer = new pixi.Renderer(1920, 1080, {
//   antialias: true,
//   autoResize: true,
// });



export const store = configureStore({
  reducer: {
    [midiMessageSlice.name]: midiMessageSlice.reducer,
    [participantSlice.name]: participantSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    [pixiAppSlice.name]: pixiAppSlice.reducer,
  }
});
