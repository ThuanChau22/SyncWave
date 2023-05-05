import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// Midi Message slice
const midiMessageEntityAdapter = createEntityAdapter();
const midiMessageSlice = createSlice({
  name: "midi-message",
  initialState: midiMessageEntityAdapter.getInitialState({
    id: "",
    input: {},
    message: {},
  }),
  reducers: {
    midiMessageStateSetId(state, action) {
      state.id = action.payload;
    },
    midiMessageStateSetInput(state, action) {
      state.input = {
        source: state.id,
        message: action.payload,
      };
    },
    midiMessageStateSetMessage(state, action) {
      state.message = action.payload;
    },
    midiMessageStateClear() {
      return midiMessageSlice.getInitialState();
    },
  },
});

// Midi Message actions
const { midiMessageStateSetId } = midiMessageSlice.actions;
const { midiMessageStateSetInput } = midiMessageSlice.actions;
const { midiMessageStateSetMessage } = midiMessageSlice.actions;
const { midiMessageStateClear } = midiMessageSlice.actions;

// Midi Message selectors
const selectMidiMessage = (state) => {
  return state[midiMessageSlice.name];
};
const selectMidiMessageId = (state) => {
  return selectMidiMessage(state).id;
};
const selectMidiMessageInput = (state) => {
  return selectMidiMessage(state).input;
};
const selectMidiMessageMessage = (state) => {
  return selectMidiMessage(state).message;
};

export {
  midiMessageSlice,
  midiMessageStateSetId,
  midiMessageStateSetInput,
  midiMessageStateSetMessage,
  midiMessageStateClear,
  selectMidiMessageId,
  selectMidiMessageInput,
  selectMidiMessageMessage,
}