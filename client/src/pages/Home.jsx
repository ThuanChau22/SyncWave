import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";

import { midiMessageStateSetId } from "redux/slices/midiMessageSlice";
import { participantStateSetId } from "redux/slices/participantSlice";
import { sessionStateSetId } from "redux/slices/sessionSlice";
import { sessionStateSetUserId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";

// Session API endpoint
const { REACT_APP_API_DOMAIN } = process.env;
const axiosInstance = axios.create({ baseURL: REACT_APP_API_DOMAIN || "/" });
const sessionAPI = "/api/session";


const Home = () => {
  const sessionStatus = useSelector(selectSessionStatus);
  const { Connecting } = sessionStatus.options;
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
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LoadingButton
        size="small"
        onClick={handleCreateSession}
        loading={createLoading}
        loadingIndicator="Loading…"
        variant="outlined"
      >
        <Typography>Create Session</Typography>
      </LoadingButton>
      <TextField
        label="Session ID"
        type="text"
        onChange={(e) => setSessionId(e.target.value)}
      />
      <LoadingButton
        size="small"
        onClick={handleJoinSession}
        loading={joinLoading}
        loadingIndicator="Loading…"
        variant="outlined"
      >
        <Typography>Join Session</Typography>
      </LoadingButton>
      {sessionStatus.value === Connecting && (
        <Typography>Connecting</Typography>
      )}
    </Container>
  );
};

export default Home;
