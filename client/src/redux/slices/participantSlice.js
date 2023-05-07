import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// Participant slice
const participantEntityAdapter = createEntityAdapter();
const participantSlice = createSlice({
  name: "participant",
  initialState: participantEntityAdapter.getInitialState({
    id: "",
  }),
  reducers: {
    participantStateSetId(state, action) {
      state.id = action.payload;
    },
    participantStateAdd(state, action) {
      const { userId: id, value } = action.payload;
      participantEntityAdapter.addOne(state, { id, ...value });
    },
    participantStateRemove(state, action) {
      const userId = action.payload;
      participantEntityAdapter.removeOne(state, userId);
    },
    participantStateClear() {
      return participantSlice.getInitialState();
    },
  },
});

// Participant actions
const { participantStateSetId } = participantSlice.actions;
const { participantStateAdd } = participantSlice.actions;
const { participantStateRemove } = participantSlice.actions;
const { participantStateClear } = participantSlice.actions;

// Participant selectors
const selectParticipant = (state) => {
  return state[participantSlice.name];
};
const selectParticipantId = (state) => {
  return selectParticipant(state).id;
};
const participantSelectors = participantEntityAdapter.getSelectors(selectParticipant);
const selectParticipants = participantSelectors.selectAll;

export {
  participantSlice,
  participantStateSetId,
  participantStateAdd,
  participantStateRemove,
  participantStateClear,
  selectParticipantId,
  selectParticipants,
}