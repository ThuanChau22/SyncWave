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
const wss = new WebSocketServer({ path: "/", noServer: true });

wss.on("connection", async (ws, req) => {
  try {
    // Extract session id from client request
    const [_, params] = req?.url?.split("?");
    const searchParams = new URLSearchParams(params);
    const sessionId = searchParams.get("sessionId");

    // Close socket if no session id provided
    if (!sessionId) return ws.close();

    // Signal client connecting status
    ws.send(JSON.stringify({ status: "connecting" }));

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
        try {
          const value = message.value.toString();
          ws.send(JSON.stringify({ value }));
        } catch (error) {
          console.log({ error });
        }
      }
    });

    // Validate socket connection
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Handle incoming message
    ws.on("message", async (data) => {
      try {
        await producer.send({
          topic: sessionId,
          messages: [{
            key: consumerId,
            value: data,
          }],
          compression: CompressionTypes.Snappy,
        });
      } catch (error) {
        console.log({ error });
      }
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

    // Signal client connected status
    ws.send(JSON.stringify({ status: "connected" }));
  } catch (error) {
    console.log({ error });
  }
});

// Check socket connections
const interval = setInterval(() => {
  for (const ws of wss.clients) {
    // Terminate socket if no response
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
    ws.send(JSON.stringify({ status: "ping" }));
  }
}, 10000);

// Handle socket server on close
wss.on("close", () => {
  clearInterval(interval);
});

export default wss;
