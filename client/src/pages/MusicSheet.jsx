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
import Participant from "components/Participant";

const MusicSheet = () => {
  const sessionId = useSelector(selectSessionId);
  const sessionStatus = useSelector(selectSessionStatus);
  const participants = useSelector(selectParticipants);
  const dispatch = useDispatch();

  const handleEndSession = () => {
    const { Disconnected } = sessionStatus.options;
    dispatch(sessionStateSetStatus(Disconnected));
  };

  return (
    <Container
      sx={{
        marginTop: 5,
       
        display: "flex",
        flexDirection: "column",
      }}>
        <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleEndSession} >
          End Session
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
      {
        participants.map((participant) => {
          const { id } = participant;
          return <Participant key={id} userId={id} />
        })
      }
      </Box>
    </Container >
  );
};

export default MusicSheet;
