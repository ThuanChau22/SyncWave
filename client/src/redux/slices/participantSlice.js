import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// Participant slice
const participantEntityAdapter = createEntityAdapter();
const participantSlice = createSlice({
  name: "participant",
  initialState: participantEntityAdapter.getInitialState({
    id: "",
    message: {},
  }),
  reducers: {
    participantStateSetId(state, action) {
      state.id = action.payload;
    },
    participantStateSetMessage(state, action) {
      state.message = action.payload;
    },
    participantStateClear() {
      return participantSlice.getInitialState();
    },
  },
});

// Participant actions
const { participantStateSetId } = participantSlice.actions;
const { participantStateSetMessage } = participantSlice.actions;
const { participantStateClear } = participantSlice.actions;

// Participant selectors
const selectParticipant = (state) => {
  return state[participantSlice.name];
};
const selectParticipantId = (state) => {
  return selectParticipant(state).id;
};
const selectParticipantMessage = (state) => {
  return selectParticipant(state).message;
};

export {
  participantSlice,
  participantStateSetId,
  participantStateSetMessage,
  participantStateClear,
  selectParticipantId,
  selectParticipantMessage,
}