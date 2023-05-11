import * as types from 'constants/actionTypes';

export function clickedCount(state = 0, action) {
  switch (action.type) {
    case types.ADD:
      return ++state;
    case types.RESET:
      return 0;
  }
  return state;
}


export function clickedNoteData(state = 0, action) {
  switch (action.type) {
    case types.SET_NOTE_DATA:
      return action.payload;
  }
  return state;
}