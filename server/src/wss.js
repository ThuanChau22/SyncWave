import KafkaJS from "kafkajs";
import SnappyCodec from "kafkajs-snappy";
import { encode } from "safe-base64";
import { v4 as uuid } from "uuid";
import { WebSocketServer } from "ws";

import { kafka } from "./config.js";

// Apply compression codec
const { CompressionTypes, CompressionCodecs } = KafkaJS;
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

// Initiate web socket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async (ws, req) => {
  // Extract session id from client request
  const params = req?.url?.split("?")[1];
  const searchParams = new URLSearchParams(params);
  const sessionId = searchParams.get("sessionId");

  // Close socket if no session id provided
  if (!sessionId) return ws.close();

  // Setup producer
  const { Partitioners: { LegacyPartitioner } } = KafkaJS;
  const producer = kafka.producer({ createPartitioner: LegacyPartitioner });
  await producer.connect();

  // Setup consumer
  const consumerId = encode(Buffer.from(uuid()));
  const consumer = kafka.consumer({ groupId: `${sessionId}${consumerId}` });
  await consumer.connect();
  await consumer.subscribe({ topic: sessionId });
  await consumer.run({
    eachMessage: ({ message }) => {
      const value = message.value?.toString();
      ws.send(JSON.stringify({ value }));
    }
  });

  // Validate socket connection
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // Handle incoming message
  ws.on("message", async (data) => {
    data = JSON.parse(data.toString());
    const key = consumerId;
    const value = data?.value;
    await producer.send({
      topic: sessionId,
      messages: [{ key, value }],
      compression: CompressionTypes.Snappy,
    });
  });

  // Handle socket on error
  ws.on("error", (error) => {
    console.log({ error });
  });

  // Handle socket on close
  ws.on("close", (error) => {
    producer?.disconnect();
    consumer?.disconnect();
    console.log({ error });
  });
});

// Check socket connections
const interval = setInterval(() => {
  for (const ws of wss.clients) {
    // Terminate socket if no response
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
    ws.send(JSON.stringify({ value: "ping" }));
  }
}, 10000);

// Handle socket server on close
wss.on("close", () => {
  clearInterval(interval);
});

export default wss;
