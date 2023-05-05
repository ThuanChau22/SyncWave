import KafkaJS from "kafkajs";
import CryptoJs from "crypto-js";
import { WebSocketServer } from "ws";

import kafkaService from "./kafka-service.js";

// Initiate web socket server
const wss = new WebSocketServer({ path: "/", noServer: true });

// Handle socket connection
wss.on("connection", async (ws, req) => {
  try {
    // Extract session id from client request
    const [_, params] = req?.url?.split("?");
    const searchParams = new URLSearchParams(params);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");

    // Close socket if no session id provided
    if (!sessionId || !userId) return ws.close(1000);

    // Signal connecting
    ws.send(JSON.stringify({
      source: sessionId,
      message: "connecting",
    }));

    // Connect kafka producer and consumer
    const groupId = CryptoJs.SHA256(`${sessionId}${userId}`).toString();
    const [producer, consumer] = await Promise.all([
      kafkaService.connectProducer(),
      kafkaService.connectConsumer(groupId),
    ]);

    // Set topic subscriptions
    const userStatus = kafkaService.getTopicId({
      prefix: kafkaService.topics.UserStatus,
      topic: sessionId,
    });
    const midiMessage = kafkaService.getTopicId({
      prefix: kafkaService.topics.MidiMessage,
      topic: sessionId,
    });
    await Promise.all([
      consumer.subscribe({ topics: [userStatus], fromBeginning: true }),
      consumer.subscribe({ topics: [midiMessage], fromBeginning: false }),
    ]);

    // Set user active
    const value = JSON.stringify({ active: true });
    await producer.send({
      topic: userStatus,
      messages: [{ key: userId, value }],
      compression: KafkaJS.CompressionTypes.Snappy,
    });

    // Send consumed message to client
    await consumer.run({
      eachMessage: ({ topic, message }) => {
        try {
          ws.send(JSON.stringify({
            source: topic,
            userId: message.key.toString(),
            message: message.value.toString(),
          }));
        } catch (error) {
          console.log({ error });
        }
      }
    });

    // Validate socket connection
    ws.isAlive = true;
    ws.on("pong", () => ws.isAlive = true);

    // Handle incoming message
    ws.on("message", async (data) => {
      try {
        const { message } = JSON.parse(data);
        const value = JSON.stringify(message);
        await producer.send({
          topic: midiMessage,
          messages: [{ key: userId, value }],
          compression: KafkaJS.CompressionTypes.Snappy,
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
    ws.on("close", async () => {
      try {
        // Set user inactive
        const value = JSON.stringify({ active: false });
        await producer.send({
          topic: userStatus,
          messages: [{ key: userId, value }],
          compression: KafkaJS.CompressionTypes.Snappy,
        });
      } catch (error) {
        console.log(error);
      } finally {
        await Promise.all([
          producer.disconnect(),
          consumer.disconnect(),
        ]);
      }
    });

    // Signal connected
    ws.send(JSON.stringify({
      source: sessionId,
      message: "connected",
    }));
  } catch (error) {
    console.log({ error });
  }
});

// Check socket connections
const delay = 10000 // 10 seconds
const interval = setInterval(() => {
  for (const ws of wss.clients) {
    // Terminate socket if no response
    if (!ws.isAlive) {
      return ws.terminate();
    };
    // Ping server and client
    ws.isAlive = false;
    ws.ping();
  }
}, delay);

// Handle socket server on close
wss.on("close", () => {
  clearInterval(interval);
});

export default wss;
