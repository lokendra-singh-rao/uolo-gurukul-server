import express from "express";
import cors from "cors";
import userRouters from "./routes/userRoute.js";
import "dotenv/config";
import { checkMongoConnection } from "./configurations/mongoDbConection.js";
import {
  ingestUser,
  initializeElasticsearch,
} from "./services/elasticSearchService.js";
import { userModel } from "./models/userModel.js";

await checkMongoConnection();
await initializeElasticsearch();

const app = express();

export const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

//User controller routers
app.use(userRouters);

app.get("/syncMongo", async (req, res) => {
  //   // initializeElasticsearch();
  const users = await userModel.find({});
  users.map(async (user) => {
    const res = await ingestUser({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      active: user.active,
    });
  });
  res.send("success");
});

//Called when an endpoint is not found
app.use((_, res) => {
  res.send({
    error: "Not found!",
  });
});

//Called when server starts
app.listen(port, (req, res) => {
  console.log("✅ Server running at http://localhost:" + `${port}`);
});
