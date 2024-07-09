import mongoose from "mongoose";

export const createConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(
      "💾 MongoDB Connected : ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
