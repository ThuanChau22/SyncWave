import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import styled from '@emotion/styled';
import { useStore , useSelector} from 'react-redux';
import { useDispatch } from "react-redux";
import { Container, autoDetectRenderer } from 'pixi.js';
import MainUI from 'pixi/views/MainUI';
import createMediators from 'pixi/mediators/createMediators';

import pixiPianoRoll from "./pixiPianoRoll.js";
import watch from 'redux-watch'

import * as pixi from 'pixi.js'
import { setNoteData, selectNoteData } from "redux/slices/pixiAppSlice";

function render({ canvas, stage, stageWidth, stageHeight }) {
  const renderer = autoDetectRenderer({
    width: stageWidth,
    height: stageHeight,
    view: canvas,
    resolution: window.devicePixelRatio,
  });
  function _render() {
    renderer.render(stage);
    requestAnimationFrame(_render);
  }
  _render();
}


const stageWidth = 400;
const stageHeight = 200;

const Canvas = styled.canvas`
  width: ${stageWidth}px;
  height: ${stageHeight}px;
`;



function PixiCanvas(props, playbackRef) {

        


    const selectedNoteData = useSelector(selectNoteData);

    //const [noteData, setNoteData] = useState([]);

    const pianoRoll = pixiPianoRoll(props, app);

    // var container = useRef();

    useImperativeHandle(playbackRef, function () {
        return pianoRoll.playback;
    });

    // useEffect(function () {
    //     //container.current.replaceChildren(pianoRoll.view);
    // });

  const canvasRef = useRef(null);
  const store = useStore();
  useEffect(() => {
    // const canvas = canvasRef.current;
    // //const stage = new MainUI();
    // const stage = pianoRoll.stage;
    // console.log(store.getState().pixiApp.noteData);
    // //console.log(selectedNoteData);
    // //pianoRoll.noteData = noteData;
    // const renderer = render({ canvas, stage, stageWidth, stageHeight });
    // //const renderer = pianoRoll.renderer;
    // //const pianoRollView = pianoRoll.view;
    // const clear = createMediators({ store, pianoRoll });
    // console.log(store.getState().pixiApp.noteData);


    const canvas = canvasRef.current;
    app.stage.addChild(pianoRoll.stage);
    app.stage.canvasRef = canvas;

    return () => {
        
        // const w = watch(store.getState, 'pixiApp.noteData');
        // let unsubscribe = store.subscribe(w((newVal, oldVal, objectPath) => {
        //   console.log('%s changed from %s to %s', objectPath, oldVal, newVal);
        //   //view.count = newVal;
        // }))
        // unsubscribe();
    }

  }, []);


  const dispatch = useDispatch();

  const setNotes = (notes) => {

    pianoRoll.noteData = notes;
//     //setNoteData(notes);

//     console.log("selectedNotes: " + selectedNoteData);

//     // pianoRoll.noteData = notes;

//     // pianoRoll.playback.play();
    
//     //console.log(store.dispatch({ type: 'setNoteData', payload: { noteData: {notes} }}))
//     //store.dispatch({ type: 'pixiApp.noteData', payload: { noteData: {notes} }})

//     console.log("before: " + store.getState().pixiApp.noteData);

//     store.dispatch(setNoteData(notes));
//    //dispatch(setNoteData(notes));
//    pianoRoll.noteData = notes;
//    console.log(store.getState());
//    //store.dispatch({ type: 'pixiApp.setNoteData', payload: { noteData: notes }})

//     console.log("after: " + store.getState().pixiApp.noteData);

  }

  const addAnotherPianoRoll = () => {  
// Create the application
// const app = new pixi.Application();
    // const pianoRollNew = pixiPianoRoll(props, app);
    // const canvas = canvasRef.current;
    // const stage = pianoRollNew.stage;
    // app.
    // app.stage = stage;
    // app.canvasRef = canvasRef;
    
  }
  
  return (
    <>
    <div>
      <Canvas ref={canvasRef} />
      <button
          onClick={() => {
            addAnotherPianoRoll();
          }}
        >
          Add Another
        </button>
      <button
          onClick={() => {
            playbackRef.current.play();
          }}
        >
          Play
        </button>
        <button
          onClick={() => {
            playbackRef.current.pause();
          }}
        >
          Pause
        </button>
        <button
          onClick={() => {
            playbackRef.current.seek("0:0:0");
          }}
        >
          Reset
        </button>
      <button
          onClick={() => {
            setNotes([
              ["0:0:0", "F5", ""],
              ["0:0:0", "C4", "2n"],
              ["0:0:0", "D4", "2n"],
              ["0:0:0", "E4", "2n"],
              ["0:2:0", "B4", "4n"],
              ["0:3:0", "A#4", "4n"],
              ["0:0:0", "F2", ""]
            ]);
          }}
        >REAL UPDATE NOTEDATA</button>
      </div>
    </>
  );
}


export default React.forwardRef(PixiCanvas)