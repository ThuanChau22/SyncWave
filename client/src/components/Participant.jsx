import { Box } from "@mui/material";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

import InteractivePiano from "../InteractivePiano/InteractivePiano";
import PixiCanvas from "InteractivePiano/PianoRoll/PixiCanvas";
import * as pixi from "pixi.js";



const Participant = ({ userId, app }) => {

  const [state, setState] = useState(0);
  const [noteData, setNoteData] = useState([]);
  const playbackRef = useRef();



  return (
    <Container
      maxWidth="md"
      sx={{
        marginBottom: 3,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          marginTop: 5,
          marginBottom: 2,
        }}
      >
        <Typography>USER ID: {userId}</Typography>
      </Box>
      <InteractivePiano userId={userId} />
      <PixiCanvas 
        gridLineColor={0x333333}
        blackGridBgColor={0x1e1e1e}
        whiteGridBgColor={0x282828}
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

export default Participant;