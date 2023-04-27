import { configureStore } from "@reduxjs/toolkit";

import { webSocketSlice } from "redux/slices/webSocketSlice"

export const store = configureStore({
  reducer: {
    [webSocketSlice.name]: webSocketSlice.reducer,
  },
});
