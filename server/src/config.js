import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import KafkaJS from "kafkajs";

dotenvExpand.expand(dotenv.config());

export const { PORT } = process.env;
export const { WEB_DOMAIN } = process.env;
const { KAFKA_SERVER_URL } = process.env;
const { KAFKA_USER } = process.env;
const { KAFKA_PASS } = process.env;

export const kafka = new KafkaJS.Kafka({
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
