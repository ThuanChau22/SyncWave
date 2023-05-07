import { useCallback, useEffect } from "react";
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
import { participantStateSetMessage } from "redux/slices/participantSlice";
import { participantStateClear } from "redux/slices/participantSlice";
import { selectParticipantId } from "redux/slices/participantSlice";
import { sessionStateSetStatus } from "redux/slices/sessionSlice";
import { sessionStateClear } from "redux/slices/sessionSlice";
import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";
import { selectSessionUserId } from "redux/slices/sessionSlice";

const App = () => {
  const theme = useTheme();
  const { REACT_APP_WEBSOCKET_DOMAIN } = process.env;
  const sessionId = useSelector(selectSessionId);
  const userId = useSelector(selectSessionUserId);
  const sessionStatus = useSelector(selectSessionStatus);
  const { Connecting, Connected, Disconnected } = sessionStatus.options;
  const participantId = useSelector(selectParticipantId);
  const midiMessageId = useSelector(selectMidiMessageId);
  const midiMessageInput = useSelector(selectMidiMessageInput);
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
      dispatch(participantStateSetMessage({ userId, value }));
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
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {sessionStatus.value === Connecting ? (
          <WaveLoader
            color={theme.palette.primary.main}
            loading={true}
            size={50}
          />
        ) : sessionStatus.value === Connected ? (
          <MusicSheet />
        ) : (
          <Home />
        )}
      </Box>
    </Container>
  );
};

export default App;
