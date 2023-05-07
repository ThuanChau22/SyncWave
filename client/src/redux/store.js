import { configureStore } from "@reduxjs/toolkit";

import { midiMessageSlice } from "redux/slices/midiMessageSlice";
import { participantSlice } from "redux/slices/participantSlice";
import { sessionSlice } from "redux/slices/sessionSlice";

export const store = configureStore({
  reducer: {
    [midiMessageSlice.name]: midiMessageSlice.reducer,
    [participantSlice.name]: participantSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
  },
});
