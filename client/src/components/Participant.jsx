import { Box } from "@mui/material";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";

import InteractivePiano from "../InteractivePiano/InteractivePiano";

const Participant = ({ userId }) => {
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
    </Container>
  );
};

export default Participant;