import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const checkMongoConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URI);
    logger.info(
      "✅ MongoDB Connected : ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    logger.error("❌ Error connecting mongodb", err.message);
    process.exit(1);
  }
};
