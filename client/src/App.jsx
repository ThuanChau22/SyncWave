import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";

import Home from "pages/Home";
import MusicSheet from "pages/MusicSheet";
import { sessionStateSetStatus } from "redux/slices/sessionSlice";
import { sessionStateSetMessage } from "redux/slices/sessionSlice";
// import { sessionStateClear } from "redux/slices/sessionSlice";
import { selectSessionId } from "redux/slices/sessionSlice";
import { selectSessionStatus } from "redux/slices/sessionSlice";
import { selectSessionInput } from "redux/slices/sessionSlice";

const App = () => {
  const sessionId = useSelector(selectSessionId);
  const sessionStatus = useSelector(selectSessionStatus);
  const sessionStatusOptions = sessionStatus.options;
  const sessionInput = useSelector(selectSessionInput);
  const [webSocket, setWebSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionId) {
      const { REACT_APP_WEBSOCKET_DOMAIN } = process.env;
      const param = `sessionId=${sessionId}`;
      const url = `${REACT_APP_WEBSOCKET_DOMAIN}?${param}`;
      setWebSocket(new WebSocket(url));
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (webSocket) {
      let pingTimeout = 0;
      const checkPingTimeout = () => {
        clearTimeout(pingTimeout);
        pingTimeout = setTimeout(() => {
          webSocket.close();
        }, 10000 + 1000);
      };
      webSocket.onopen = () => {
        checkPingTimeout();
      };
      webSocket.onmessage = ({ data }) => {
        try {
          data = JSON.parse(data);
          if (data.status === "connecting") {
            const { Connecting } = sessionStatusOptions;
            dispatch(sessionStateSetStatus(Connecting));
          } else if (data.status === "connected") {
            const { Connected } = sessionStatusOptions;
            dispatch(sessionStateSetStatus(Connected));
          } else if (data.status === "ping") {
            checkPingTimeout();
          } else {
            const message = JSON.parse(data.value)
            dispatch(sessionStateSetMessage(message));
          }
        } catch (error) {
          console.log({ error });
        }
      };
      webSocket.onerror = (e) => {
        console.log({ e });
      };
      webSocket.onclose = (e) => {
        clearTimeout(pingTimeout);
        const { Disconnected } = sessionStatusOptions;
        dispatch(sessionStateSetStatus(Disconnected));
        console.log({ e });
      };
    }
  }, [dispatch, sessionStatusOptions, webSocket]);

  useEffect(() => {
    if (webSocket && webSocket.readyState === webSocket.OPEN) {
      webSocket.send(JSON.stringify(sessionInput));
    }
  }, [webSocket, sessionInput]);

  return (
    <div>
      {sessionStatus.value === sessionStatusOptions.Connecting ? (
        <Typography>Connecting</Typography>
      ) : sessionStatus.value === sessionStatusOptions.Connected ? (
        <MusicSheet />
      ) : (
        <Home />
      )}
    </div>
  );
};

export default App;
