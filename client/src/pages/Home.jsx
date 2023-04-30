import { useState } from "react";
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import { TextField } from '@mui/material';
import { useDispatch } from "react-redux";

import { sessionCreate } from "redux/slices/sessionSlice";
import { sessionJoin } from "redux/slices/sessionSlice";

const Home = () => {
  const [sessionId, setSessionId] = useState("");
  const dispatch = useDispatch();

  const handleCreateSession = async () => {
    dispatch(sessionCreate());
  };

  const handleJoinSession = async () => {
    dispatch(sessionJoin(sessionId));
  }

  return (
    <Container sx={{
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
    }}>
      <Button onClick={handleCreateSession}>Create Session</Button>
      <TextField
        label="Session ID"
        type="text"
        onChange={(e) => setSessionId(e.target.value)}
      />
      <Button onClick={handleJoinSession}>Join Session</Button>
    </Container>
  );
};

export default Home;