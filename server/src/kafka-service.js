import KafkaJS from "kafkajs";
import SnappyCodec from "kafkajs-snappy";
import ms from "ms";
import { encode } from "safe-base64";
import { v4 as uuid } from "uuid";

import { KAFKA_SERVER_URL, KAFKA_USER, KAFKA_PASS } from "./config.js";

// Apply compression codec
const { CompressionCodecs, CompressionTypes } = KafkaJS;
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const kafkaService = {};

kafkaService.instance = new KafkaJS.Kafka({
  clientId: "syncwave",
  brokers: [KAFKA_SERVER_URL],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: KAFKA_USER,
    password: KAFKA_PASS,
  },
  logLevel: KafkaJS.logLevel.WARN,
});

kafkaService.topics = {
  UserStatus: "USER-STATUS",   // { key: userId, value: { active:true/false } }
  MidiMessage: "MIDI-MESSAGE", // { key: userId, value: { status, pitch, velocity } }
};

kafkaService.getTopicId = ({ topic, prefix = "", suffix = "" } = {}) => {
  const filter = (e) => e !== "" && e !== null;
  return [prefix, topic, suffix].filter(filter).join("-");
};

kafkaService.createTopics = async ({ topics, validateOnly }) => {
  const admin = kafkaService.instance.admin();
  try {
    await admin.connect();
    topics = topics.map((topic) => ({
      topic,
      numPartitions: 1,
      replicationFactor: 3, // Has to be 3 ¯\_(ツ)_/¯
      configEntries: [{
        name: "retention.ms",
        value: ms("3d").toString(),
      }],
    }));
    return await admin.createTopics({ topics, validateOnly });
  } catch (error) {
    throw error;
  } finally {
    await admin.disconnect();
  }
};

kafkaService.connectProducer = async () => {
  const { Partitioners: { LegacyPartitioner } } = KafkaJS;
  const config = { createPartitioner: LegacyPartitioner };
  const producer = kafkaService.instance.producer(config);
  await producer.connect();
  return producer;
};

kafkaService.connectConsumer = async () => {
  const config = { groupId: encode(Buffer.from(uuid())) };
  const consumer = kafkaService.instance.consumer(config);
  await consumer.connect();
  return consumer;
};

export default kafkaService;
