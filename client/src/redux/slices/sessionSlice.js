import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const { REACT_APP_API_DOMAIN } = process.env;

// Session API endpoint
const axiosInstance = axios.create({ baseURL: REACT_APP_API_DOMAIN || "/" });
const sessionAPI = "/api/session";

// Session slice
const sessionSlice = createSlice({
  name: "session",
  initialState: {
    id: "",
    status: {
      value: "init",
      options: {
        Init: "init",
        Connecting: "connecting",
        Connected: "connected",
        Disconnected: "disconnected",
      },
    },
    input: "",
    message: "",
  },
  reducers: {
    sessionStateSetId(state, action) {
      state.id = action.payload;
    },
    sessionStateSetStatus(state, action) {
      state.status.value = action.payload;
    },
    sessionStateSetInput(state, action) {
      state.input = action.payload;
    },
    sessionStateSetMessage(state, action) {
      state.message = action.payload;
    },
    sessionStateClear(state) {
      state.webSocket?.close();
      clearTimeout(state.pingTimeout);
      return sessionSlice.getInitialState();
    },
  },
});

// Session actions
const { sessionStateSetId } = sessionSlice.actions;
const { sessionStateSetStatus } = sessionSlice.actions;
const { sessionStateSetInput } = sessionSlice.actions;
const { sessionStateSetMessage } = sessionSlice.actions;
const { sessionStateClear } = sessionSlice.actions;

// Create a new session
const sessionCreate = createAsyncThunk(
  `${sessionSlice.name}/create`,
  async (_, { dispatch }) => {
    try {
      const { data } = await axiosInstance.post(sessionAPI);
      dispatch(sessionStateSetId(data.sessionId));
    } catch (error) {
      console.log({ error });
    }
  }
);

// Join an existing session
const sessionJoin = createAsyncThunk(
  `${sessionSlice.name}/join`,
  async (sessionId, { dispatch }) => {
    try {
      dispatch(sessionStateSetId(sessionId));
    } catch (error) {
      console.log({ error });
    }
  }
);

// Session selectors
const selectSession = (state) => {
  return state[sessionSlice.name];
};
const selectSessionId = (state) => {
  return selectSession(state).id;
};
const selectSessionStatus = (state) => {
  return selectSession(state).status;
};
const selectSessionInput = (state) => {
  return selectSession(state).input;
};
const selectSessionMessage = (state) => {
  return selectSession(state).message;
};

export {
  sessionSlice,
  sessionStateSetStatus,
  sessionStateSetInput,
  sessionStateSetMessage,
  sessionStateClear,
  sessionCreate,
  sessionJoin,
  selectSessionId,
  selectSessionStatus,
  selectSessionInput,
  selectSessionMessage,
}