import express from "express";
import cors from "cors";
import userRouters from "./routes/userRoute.js";
import "dotenv/config";
import { checkMongoConnection } from "./configs/mongoDbConection.js";
import { initializeElasticsearch } from "./services/elasticSearch.js";
import { logger } from "./utils/logger.js";
import fs from "fs";

await checkMongoConnection();
await initializeElasticsearch();

const app = express();

export const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

//User controller routers
app.use(userRouters);

//Called when an endpoint is not found
app.use((_, res) => {
  res.send({
    error: "Not found!",
  });
});

//Called when server starts
app.listen(port, (req, res) => {
  logger.info("✅ Server running at http://localhost:" + `${port}`);
});
