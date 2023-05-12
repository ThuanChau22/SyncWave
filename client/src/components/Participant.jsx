import { Box } from "@mui/material";
import { Container } from "@mui/material";

import InteractivePiano from "../InteractivePiano/InteractivePiano";
import PianoRoll from "../InteractivePiano/PianoRoll"

const Participant = ({ userId }) => {
  return (
    <Container
      sx={{
        marginBottom: 3,
        alignItems: "start",
        display: "flex",
        flexDirection: "row",
        marginLeft: -10,
        backgroundColor: "#252730",
        borderRadius: 5,
        shadowBlur: 1,
        shadowColor: "rgba(0, 0, 0, 0.25)",
        position: "relative",
        width: "100%",
      }}
      maxWidth={false}
    >
      <InteractivePiano userId={userId} />
      <Box
        sx={{
          marginLeft: 1,
        }}
      />
      <PianoRoll />
    </Container>
  );
};

export default Participant;