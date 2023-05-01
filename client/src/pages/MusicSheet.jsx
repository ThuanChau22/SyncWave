import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";

import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionMessage } from "redux/slices/sessionSlice";
import { sessionStateSetInput } from "redux/slices/sessionSlice";
// import { Piano } from "piano/Piano";

const MusicSheet = () => {
  const sessionId = useSelector(selectSessionId);
  const message = useSelector(selectSessionMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = ({ key, repeat }) => {
      if (!repeat) {
        console.log({ source: "post", key });
        dispatch(sessionStateSetInput({ key }));
      }
    };
    window.onkeydown = handleKeyDown;
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    console.log({ source: "get", ...message });
  }, [message])

  return (
    <Container>
      {/* <Piano /> */}
      <Typography>Session Id: {sessionId}</Typography>
      <Typography>Message: {JSON.stringify(message)}</Typography>
    </Container>
  );
};

export default MusicSheet;
