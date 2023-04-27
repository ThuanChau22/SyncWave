const { createSlice } = require("@reduxjs/toolkit");

const { REACT_APP_WEBSOCKET_DOMAIN } = process.env;

const webSocketSlice = createSlice({
  name: "websocket",
  initialState: {
    
  },
  reducers: {},
  extraReducers: {},
});

export {
  webSocketSlice
}