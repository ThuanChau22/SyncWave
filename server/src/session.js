import express from "express";
import { encode } from "safe-base64";
import { v4 as uuid } from "uuid";

import { kafka } from "./config.js";

const router = express.Router();

/**
 * @route POST /session
 */
router.post("/", async (_, res) => {
  try {
    const sessionId = "test"; // encode(Buffer.from(uuid()));
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [{
        topic: sessionId,
        numPartitions: 1,
        replicationFactor: 3, // Has to be 3 ¯\_(ツ)_/¯
      }]
    });
    await admin.disconnect();
    res.status(201).json({ sessionId });
  }
  catch (error) {
    console.error({ error });
  }
});

export default router;
