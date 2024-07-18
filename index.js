import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import "dotenv/config";
import { checkMongoConnection } from "./configs/mongoDbConection.js";
import { initializeElasticsearch } from "./services/elasticSearch.js";
import { logger } from "./utils/logger.js";
import { cronJob } from "./services/cronJobs.js";
import cookieParser from "cookie-parser";

await checkMongoConnection();
await initializeElasticsearch();
cronJob;

const app = express();

export const port = process.env.PORT || 8080;

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/images", express.static("images"));

//User controller routers
app.use(userRoutes);
app.use(authRoutes);

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
