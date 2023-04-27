import { WebSocketServer } from "ws";

// Initiate web socket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log(wss.clients.size);

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data) => {
    try {
      data = JSON.parse(data.toString());
      ws.send(JSON.stringify(data));
    } catch (error) {
      console.log({ error });
    }
    console.log({ data });
  });

  ws.on("error", (error) => {
    console.log({ error });
  });

  ws.on("close", (error) => {
    console.log({ error });
  })
});

const interval = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive) {
      ws.isAlive = false;
      ws.ping();
      ws.send(JSON.stringify({ value: "ping" }));
    } else {
      ws.terminate();
    }
  }
}, 10000);

wss.on("close", () => {
  clearInterval(interval);
});

export default wss;