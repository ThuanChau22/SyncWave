import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { inputLabelClasses } from "@mui/material/InputLabel";
import axios from "axios";

import { midiMessageStateSetId } from "redux/slices/midiMessageSlice";
import { participantStateSetId } from "redux/slices/participantSlice";
import { sessionStateSetId } from "redux/slices/sessionSlice";
import { sessionStateSetUserId } from "redux/slices/sessionSlice";

// Session API endpoint
const { REACT_APP_API_DOMAIN } = process.env;
const axiosInstance = axios.create({ baseURL: REACT_APP_API_DOMAIN || "/" });
const sessionAPI = "/api/session";

const Home = () => {
  const [sessionId, setSessionId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSetIds = (data) => {
    dispatch(sessionStateSetId(data.sessionId));
    dispatch(sessionStateSetUserId(data.userId));
    dispatch(midiMessageStateSetId(data.topicIds.midiMessage));
    dispatch(participantStateSetId(data.topicIds.userStatus));
  };

  const handleCreateSession = async () => {
    try {
      setCreateLoading(true);
      const { data } = await axiosInstance.post(sessionAPI);
      handleSetIds(data);
    } catch (error) {
      console.log({ error });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinSession = async () => {
    try {
      setJoinLoading(true);
      const params = `id=${sessionId}`;
      const { data } = await axiosInstance.get(`${sessionAPI}?${params}`);
      handleSetIds(data);
    } catch (error) {
      console.log({ error });
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <Container
      sx={{
        marginTop: 20,
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <TextField
          size="small"
          label="Session ID"
          
          type="text"
          InputLabelProps={{
            sx: {
              // set the color of the label when not shrinked
              color: "white",
              [`&.${inputLabelClasses.shrink}`]: {
                // set the color of the label when shrinked (usually when the TextField is focused)
                color: "rgb(205, 225, 215)"
              }
            }
          }}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <LoadingButton
          size="large"
          onClick={handleJoinSession}
          loading={joinLoading}
          loadingIndicator="Loading…"
          variant="outlined"
        >
          <Typography>Join Session</Typography>
        </LoadingButton>
      </Box>
      <Box
        sx={{
          marginTop: 5,
        }}
      >
        <LoadingButton
          size="large"
          onClick={handleCreateSession}
          loading={createLoading}
          loadingIndicator="Loading…"
          variant="outlined"
        >
          <Typography>Create Session</Typography>
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default Home;
