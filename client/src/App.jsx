import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WaveLoader } from "react-loaders-kit";
import { useTheme } from "@emotion/react";
import { Box } from '@mui/material';
import { Container } from '@mui/material';

import Home from "pages/Home";
import MusicSheet from "pages/MusicSheet";
import { midiMessageStateSetMessage } from "redux/slices/midiMessageSlice";
import { midiMessageStateClear } from "redux/slices/midiMessageSlice";
import { selectMidiMessageId } from "redux/slices/midiMessageSlice";
import { selectMidiMessageInput } from "redux/slices/midiMessageSlice";
import { participantStateAdd } from "redux/slices/participantSlice";
import { participantStateRemove } from "redux/slices/participantSlice";
import { participantStateClear } from "redux/slices/participantSlice";
import { selectParticipantId } from "redux/slices/participantSlice";
import { sessionStateSetStatus } from "redux/slices/sessionSlice";
import { sessionStateClear } from "redux/slices/sessionSlice";
import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";
import { selectSessionUserId } from "redux/slices/sessionSlice";

import { selectNoteData } from "redux/slices/pixiAppSlice";

import { setNoteData } from "redux/slices/pixiAppSlice";

import * as pixi from 'pixi.js';
import {selectRenderer} from "redux/slices/pixiAppSlice";
import {setRenderer } from "redux/slices/pixiAppSlice";

import {Recording} from "InteractivePiano/Recording";
import pixiPianoRoll from "./InteractivePiano/PianoRoll/pixiPianoRoll.js";

import PixiCanvas from "./InteractivePiano/PianoRoll/PixiCanvas.js";


import ButtonGroup from 'InteractivePiano/PianoRoll/ButtonGroup';

import PianoRoll from "./InteractivePiano/PianoRoll/PianoRoll.js";

const App = (props) => {
  const theme = useTheme();
  const { REACT_APP_WEBSOCKET_DOMAIN } = process.env;
  const sessionId = useSelector(selectSessionId);
  const userId = useSelector(selectSessionUserId);
  const sessionStatus = useSelector(selectSessionStatus);
  const { Connecting, Connected, Disconnected } = sessionStatus.options;
  const participantId = useSelector(selectParticipantId);
  const midiMessageId = useSelector(selectMidiMessageId);
  const midiMessageInput = useSelector(selectMidiMessageInput);

  
  //const noteData = useSelector(selectNoteData);

  const {
    readyState, lastJsonMessage,
    sendJsonMessage, getWebSocket,
  } = useWebSocket(REACT_APP_WEBSOCKET_DOMAIN, {
    queryParams: { sessionId, userId },
    shouldReconnect: (error) => error.code === 1006,
    // onClose: (error) => { console.log({ error }) },
    // onError: (error) => { console.log({ error }) },
  });
  const dispatch = useDispatch();

  // Handle update session status
  const handleSetStatus = useCallback(({ source, message }) => {
    if (source === sessionId && message === "connecting") {
      dispatch(sessionStateSetStatus(Connecting));
    }
    if (source === sessionId && message === "connected") {
      dispatch(sessionStateSetStatus(Connected));
    }
  }, [dispatch, sessionId, Connecting, Connected]);

  // Handle update midi and participant message
  const handleSetMessage = useCallback(({ source, userId, message }) => {
    if (source === participantId) {
      const value = JSON.parse(message);
      if (value.active) {
        dispatch(participantStateAdd({ userId, value }));
      } else {
        dispatch(participantStateRemove(userId));
      }
    }
    if (source === midiMessageId) {
      const value = JSON.parse(message);
      dispatch(midiMessageStateSetMessage({ userId, value }));
    }
  }, [dispatch, participantId, midiMessageId]);

  // Handle incoming messages
  useEffect(() => {
    try {
      if (lastJsonMessage) {
        const { source, userId, message } = lastJsonMessage;
        handleSetStatus({ source, message });
        handleSetMessage({ source, userId, message });
      }
    } catch (error) {
      console.log({ error });
    }
  }, [dispatch, lastJsonMessage, handleSetStatus, handleSetMessage]);

  // Send Midi input
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage(midiMessageInput);
    }
  }, [readyState, sendJsonMessage, midiMessageInput]);

  // Disconnect from web socket server
  useEffect(() => {
    const isDisconnected = sessionStatus.value === Disconnected;
    if (readyState === ReadyState.OPEN && isDisconnected) {
      getWebSocket()?.close(1000);
      dispatch(participantStateClear());
      dispatch(midiMessageStateClear());
      dispatch(sessionStateClear());
    }
  }, [dispatch, readyState, getWebSocket, sessionStatus, Disconnected]);




  const [pianoRoll, setPianoRoll] = useState(true);


  // const pixiRenderer = useSelector(selectRenderer);
  // //const dispatch = useDispatch();

  // useEffect(() => {
  //   const renderer = new pixi.Renderer(1920, 1080, {
  //     antialias: true,
  //     autoResize: true,
  //   });
  //   dispatch(setRenderer(renderer));
  // }, [dispatch]);


  const [state, setState] = useState(0);
  //const [noteData, setNoteData] = useState([]);
  const playbackRef = useRef();

  


  const handleSetNoteData = (notes) => {
    console.log("before: " + notes);
    dispatch(setNoteData(notes));
    //console.log(setNoteData(notes));
    console.log("after: " + notes);
  };

  return (
    <Container maxWidth={false}>
      {sessionStatus.value === Connecting ? (
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <WaveLoader
            color={theme.palette.primary.main}
            loading={true}
            size={50}
          />
        </Box>
      ) : sessionStatus.value === Connected ? (
        <div>
          <MusicSheet/>
          {pianoRoll === true ? (<div><PixiCanvas gridLineColor={0x333333}
        blackGridBgColor={0x1e1e1e}
        whiteGridBgColor={0x282828}
        
        ref={playbackRef}/> 
        {/* <ButtonGroup/>  */}
        <button
        onClick={() => {
          handleSetNoteData([
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
        </div>):(<div></div>)}
         </div>
      ) : (
        <Home />
      )}

        

    </Container>
  );
};

export default App;
