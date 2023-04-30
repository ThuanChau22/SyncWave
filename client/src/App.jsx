import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const { Connected, Connecting, Disconnected } = sessionStatus.options;
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
      }
      webSocket.onmessage = ({ data }) => {
        data = JSON.parse(data);
        if (data?.flag === "connected") {
          dispatch(sessionStateSetStatus(Connected));
        } else if (data?.flag === "ping") {
          checkPingTimeout();
        } else {
          dispatch(sessionStateSetMessage(data.value));
        }
      }
      webSocket.onerror = (e) => {
        console.log({ e });
      }
      webSocket.onclose = (e) => {
        clearTimeout(pingTimeout);
        dispatch(sessionStateSetStatus(Disconnected));
        console.log({ e });
      };
    }
  }, [dispatch, webSocket, Connected, Disconnected]);

  useEffect(() => {
    if (webSocket && webSocket.readyState === webSocket.OPEN) {
      webSocket.send(JSON.stringify({ value: sessionInput }));
    }
  }, [webSocket, sessionInput]);

  return (
    <div>
      {sessionStatus.value === Connecting
        ? <p>Connecting</p>
        : sessionStatus.value === Connected
          ? <MusicSheet />
          : <Home />
      }
    </div>
  );
}

export default App;
