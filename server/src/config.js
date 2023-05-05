import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

// Read .env variables
dotenvExpand.expand(dotenv.config());
export const { PORT } = process.env;
export const { WEB_DOMAIN } = process.env;
export const { KAFKA_SERVER_URL } = process.env;
export const { KAFKA_USER } = process.env;
export const { KAFKA_PASS } = process.env;
