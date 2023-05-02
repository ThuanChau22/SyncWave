import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";

import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionMessage } from "redux/slices/sessionSlice";
import { sessionStateSetInput } from "redux/slices/sessionSlice";

import InteractivePiano from "../InteractivePiano/InteractivePiano";


const MusicSheet = () => {
  const sessionId = useSelector(selectSessionId);
  const message = useSelector(selectSessionMessage);
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { value } = e.target;
    dispatch(sessionStateSetInput(value));
  };

  return (
    <Container>
      <InteractivePiano />
      <Typography>Session Id: {sessionId}</Typography>
      <TextField type="text" value={message} onChange={handleOnChange} />
      <Typography>Message: {message}</Typography>
    </Container>
  );
};

export default MusicSheet;
