import mongoose from "mongoose";

export const createConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (err) {
    process.exit(1);
  }
};
