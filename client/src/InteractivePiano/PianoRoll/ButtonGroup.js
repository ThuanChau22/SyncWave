import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { add, reset, setNoteData } from 'actions';

const Button = styled.button`
  width: 200px;
  height: 40px;
`;

export default function ButtonGroup(props) {
  const clickedCount = useSelector(state => state.clickedCount);

  const noteData = useSelector(state => state.noteData);
  const dispatch = useDispatch();
  return (
    <div>
      <Button onClick={() => { dispatch(add()) }}>{clickedCount}</Button>
      <Button onClick={() => { dispatch(reset()) }}>reset</Button>

      
      <Button onClick={() => { dispatch(setNoteData([
              ["0:0:0", "F5", ""],
              ["0:0:0", "C4", "2n"],
              ["0:0:0", "D4", "2n"],
              ["0:0:0", "E4", "2n"],
              ["0:2:0", "B4", "4n"],
              ["0:3:0", "A#4", "4n"],
              ["0:0:0", "F2", ""]
            ])) }}>SET NOTE DATA</Button>

      {/* <button onClick={() => setState(state + 1)}>set state</button>
        <p>State: {state}</p>
        <button
          onClick={() => {
            setNoteData([
              ["0:0:0", "F5", ""],
              ["0:0:0", "C4", "2n"],
              ["0:0:0", "D4", "2n"],
              ["0:0:0", "E4", "2n"],
              ["0:2:0", "B4", "4n"],
              ["0:3:0", "A#4", "4n"],
              ["0:0:0", "F2", ""]
            ]);
          }}
        >
          Update noteData
        </button> */}
        {/* <button
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
        </button> */}
    </div>
  )
}