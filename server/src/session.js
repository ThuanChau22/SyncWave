import express from "express";
import HttpError from "http-errors";
import { encode } from "safe-base64";
import { v4 as uuid } from "uuid";

import kafkaService from "./kafka-service.js";

const router = express.Router();

/**
 * @route GET /session
 * @parameters
 *  @param id (String)
 */
router.get("/", async (req, res) => {
  try {
    const sessionId = req.query.id;
    const userId = encode(Buffer.from(uuid()));
    const topicIds = {
      userStatus: kafkaService.getTopicId({
        prefix: kafkaService.topics.UserStatus,
        topic: sessionId,
      }),
      midiMessage: kafkaService.getTopicId({
        prefix: kafkaService.topics.MidiMessage,
        topic: sessionId,
      }),
    };
    await kafkaService.createTopics({
      topics: Object.values(topicIds),
      validateOnly: true,
    });
    res.status(200).json({ sessionId, userId, topicIds });
  } catch (error) {
    if (error.code === 3) {
      const message = "Session not found.";
      error = HttpError.NotFound(message);
    }
    if (HttpError.isHttpError(error)) {
      const { status, message } = error;
      res.status(status).json({ message });
    }
    console.log({ error });
  }
});

/**
 * @route POST /session
 */
router.post("/", async (_, res) => {
  try {
    const sessionId = "TEST"; // encode(Buffer.from(uuid()));
    const userId = encode(Buffer.from(uuid()));
    const topicIds = {
      userStatus: kafkaService.getTopicId({
        prefix: kafkaService.topics.UserStatus,
        topic: sessionId,
      }),
      midiMessage: kafkaService.getTopicId({
        prefix: kafkaService.topics.MidiMessage,
        topic: sessionId,
      })
    };
    const topics = Object.values(topicIds);
    const isCreated = await kafkaService.createTopics({ topics });
    if (!isCreated) {
      const message = "Session already existed."
      throw HttpError.Conflict(message);
    }
    res.status(201).json({ sessionId, userId, topicIds });
  }
  catch (error) {
    if (HttpError.isHttpError(error)) {
      const { status, message } = error;
      res.status(status).json({ message });
    }
    console.log({ error });
  }
});

export default router;
