import { userModel, changeStream } from "../models/userModel.js";
import { logger } from "../utils/logger.js";
import { ingestUser, updateUser } from "./elasticSearch.js";

async function handleChange(change) {
  const { operationType, updateDescription, documentKey, fullDocument } =
    change;

  if (operationType === "insert") {
    await ingestUser({
      id: fullDocument._id,
      name: fullDocument.name,
      email: fullDocument.email,
      image: fullDocument.image,
      createdAt: fullDocument.createdAt,
      updatedAt: fullDocument.updatedAt,
      active: fullDocument.active,
    });
  } else if (operationType === "update") {
    await updateUser(documentKey._id, updateDescription.updatedFields);
  } else {
    // any new operation will be added here
  }
}

export async function syncUsingChangeStreams() {
  try {
    changeStream.on("change", async (change) => {
      try {
        console.log(`Processed ${change.operationType} operation`);
        await handleChange(change);
      } catch (error) {
        logger.error("Error handling sync change:", error);
      }
    });
    console.log("changes finished");

    // Keep the script running
    process.on("SIGINT", async () => {
      await changeStream.close();
      process.exit();
    });
  } catch (err) {
    logger.error("Error:", err);
    await userModel.close();
  }
}
