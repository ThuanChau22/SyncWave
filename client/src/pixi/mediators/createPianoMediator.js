import { setNoteData } from 'actions';
import watch from 'redux-watch';

export default function createPianoMediator({ store, view }) {
  const { dispatch, subscribe } = store;
  // set default value
  //view.notes = store.getState().noteData;
  // redux watch and update view after redux store state update.
  
  const w = watch(store.getState, 'pixiApp.noteData');
  console.log(w);
  let unsubscribe = store.subscribe(w((newVal, oldVal, objectPath) => {
    // console.log('%s changed from %s to %s', objectPath, oldVal, newVal);
    view.notes = newVal;
  }))
  // dispatch action 
  console.log(store.getState().pixiApp.noteData);
  const onClick = (data) => {console.log("working: " + data); view.noteData = data; dispatch(setNoteData(data)); }


  console.log("testing view: " + view);
  const notes = [
    ["0:0:0", "F5", ""],

    ["0:2:0", "B4", "4n"],
    ["0:3:0", "A#4", "4n"],
    ["0:0:0", "F2", ""]
  ]
  onClick(notes);
  //view.noteData = view.notes;
  //console.log(view);
  //view.playback.play();
  //view.on('click', onClick);
  //view.on('tap', onClick);

  // clear listeners
  return () => {
    //view.off('click', onClick);
    onClick(notes);
    unsubscribe();
  }
}