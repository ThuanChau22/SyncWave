import app from "./app.js"
import wss from "./wss.js";
import { PORT } from "./config.js";

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
}).on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws);
  });
});