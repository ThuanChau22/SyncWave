import { useEffect, useState } from "react";

const Session = () => {
  const { REACT_APP_WEBSOCKET_DOMAIN } = process.env;
  const [websocket, setWebsocket] = useState(null);
  const [pingTimeout, setPingTimeout] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  // Connect on mount
  useEffect(() => {
    setWebsocket(new WebSocket(REACT_APP_WEBSOCKET_DOMAIN));
  }, [REACT_APP_WEBSOCKET_DOMAIN]);

  // Disconnect on unmount
  useEffect(() => () => {
    if (websocket) {
      websocket.close();
    }
  }, [websocket]);

  // Add listeners
  useEffect(() => {
    if (websocket) {
      const checkPingTimeout = () => {
        console.log("ping");
        clearTimeout(pingTimeout);
        setPingTimeout(setTimeout(() => {
          websocket.close();
        }, 10000 + 1000));
      };
      websocket.onopen = () => {
        checkPingTimeout();
      }
      websocket.onmessage = ({ data }) => {
        try {
          data = JSON.parse(data);
          if (data?.value === "ping") {
            checkPingTimeout();
          } else {
            setMessage(data.value);
          }
        } catch (error) {
          console.log({ error });
        }
      }
      websocket.onerror = (e) => {
        clearTimeout(pingTimeout);
        console.log({ e });
      }
      websocket.onclose = (e) => {
        clearTimeout(pingTimeout);
        console.log({ e });
      };
    }
  }, [websocket, pingTimeout]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setInput(value);
    if (websocket?.readyState === websocket?.OPEN) {
      websocket.send(JSON.stringify({ value }));
    }
  };

  const handleOnClick = () => {
    if (websocket?.readyState === websocket?.OPEN) {
      websocket.close();
    }
  };

  return (
    <div>
      <input type="text" value={input} onChange={handleOnChange} />
      <p>Message: {message}</p>
      <button onClick={handleOnClick} >Check</button>
    </div>
  );
};

export default Session;
