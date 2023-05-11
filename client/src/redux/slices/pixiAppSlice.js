import { createSlice } from '@reduxjs/toolkit'

const initialState = { renderer: null, noteData: [] }

const pixiAppSlice = createSlice({
  name: 'pixiApp',
  initialState,
  reducers: {
    setRenderer(state, action) {
      state.renderer = action.payload;
    },
    setNoteData(state, action) {
      state.noteData = action.payload;
    }
  },
})

const selectPixiApp = (state) => {
  return state[pixiAppSlice.name];
};

const selectRenderer = (state) => {
  return selectPixiApp(state).renderer; // selectSession(state).id;
};
const selectNoteData = (state) => {
  return selectPixiApp(state).noteData;
};

const { setRenderer, setNoteData } = pixiAppSlice.actions

export { pixiAppSlice, setRenderer, setNoteData , selectRenderer, selectNoteData }