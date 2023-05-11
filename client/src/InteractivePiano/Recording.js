import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";

import { selectParticipants } from "redux/slices/participantSlice";
import { sessionStateSetStatus } from "redux/slices/sessionSlice";
import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";

import { selectMidiMessageMessage } from "redux/slices/midiMessageSlice";
import Participant from "components/Participant";

import PianoRoll from "./PianoRoll/PianoRoll";


export const Recording = () => {
 


  const [state, setState] = useState(0);
  const [noteData, setNoteData] = useState([]);
  const playbackRef = useRef();


  return (
    <Container
      sx={{
        marginTop: 5,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {" "}
        Recording:{" "}
      </Typography>
      <PianoRoll
        width={810}
        height={400}
        zoom={6}
        // resolution={2}
        gridLineColor={0x333333}
        blackGridBgColor={0x1e1e1e}
        whiteGridBgColor={0x282828}
        noteData={noteData}
        ref={playbackRef}
      />
      <button onClick={() => setState(state + 1)}>set state</button>
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
      
    </Container>
  );
};
