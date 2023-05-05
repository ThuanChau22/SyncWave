import { createSlice } from "@reduxjs/toolkit";

// Session slice
const sessionSlice = createSlice({
  name: "session",
  initialState: {
    id: "",
    userId: "",
    status: {
      value: "init",
      options: {
        Init: "init",
        Connecting: "connecting",
        Connected: "connected",
        Disconnected: "disconnected",
      },
    },
  },
  reducers: {
    sessionStateSetId(state, action) {
      state.id = action.payload;
    },
    sessionStateSetStatus(state, action) {
      state.status.value = action.payload;
    },
    sessionStateSetUserId(state, action) {
      state.userId = action.payload;
    },
    sessionStateClear() {
      return sessionSlice.getInitialState();
    },
  },
});

// Session actions
const { sessionStateSetId } = sessionSlice.actions;
const { sessionStateSetStatus } = sessionSlice.actions;
const { sessionStateSetUserId } = sessionSlice.actions;
const { sessionStateClear } = sessionSlice.actions;

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
const selectSessionUserId = (state) => {
  return selectSession(state).userId;
};

export {
  sessionSlice,
  sessionStateSetId,
  sessionStateSetStatus,
  sessionStateSetUserId,
  sessionStateClear,
  selectSessionId,
  selectSessionStatus,
  selectSessionUserId,
}