import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";

import { midiMessageStateSetInput } from "redux/slices/midiMessageSlice";
import { selectMidiMessageMessage } from "redux/slices/midiMessageSlice";
import { sessionStateSetStatus } from "redux/slices/sessionSlice";
import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionUserId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";
import InteractivePiano from "../InteractivePiano/InteractivePiano";

const MusicSheet = () => {
  const sessionId = useSelector(selectSessionId);
  const userId = useSelector(selectSessionUserId);
  const sessionStatus = useSelector(selectSessionStatus);
  const message = useSelector(selectMidiMessageMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    window.onkeydown = ({ key, repeat }) => {
      if (repeat) return;
      dispatch(midiMessageStateSetInput({ key }));
    };
    return () => {
      window.onkeydown = null;
    };
  }, [dispatch]);

  const handleEndSession = () => {
    const { Disconnected } = sessionStatus.options;
    dispatch(sessionStateSetStatus(Disconnected));
  };

  return (
    <Container>
      <InteractivePiano />
      <Typography>Session Id: {sessionId}</Typography>
      <Typography>User Id: {userId}</Typography>
      <Typography>Message: {JSON.stringify(message)}</Typography>
      <Button variant="outlined" onClick={handleEndSession} >End Session</Button>
    </Container>
  );
};

export default MusicSheet;
