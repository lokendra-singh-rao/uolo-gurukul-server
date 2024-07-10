import express from "express";
import cors from "cors";
import userRouters from "./routes/userRoute.js";
import "dotenv/config";
import { createConnection } from "./configurations/mongoDbConection.js";
import { client, createIndex } from "./configurations/elasticClient.js";

await createConnection();
// await createIndex("lokendrausers");

const app = express();
export const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

//User controller routers
app.use(userRouters);

app.get("/put", (req, res) => {
  const searchProperty = {
    type: "text",
    analyzer: "autocomplete",
    search_analyzer: "standard",
  };

  //put settings
  client.indices.putSettings({
    index: "lokendrausers",
    body: {
      settings: {
        max_ngram_diff: 19,
        analysis: {
          filter: {
            autocomplete_filter: {
              type: "ngram",
              min_gram: "1",
              max_gram: "20",
            },
          },
          analyzer: {
            autocomplete: {
              filter: ["lowercase", "autocomplete_filter"],
              type: "custom",
              tokenizer: "standard",
            },
          },
        },
        number_of_replicas: "1",
      },
    },
  });

  //put mapping
  client.indices.putMapping({
    index: "lokendrausers",
    body: {
      properties: {
        id: { type: "keyword" },
        createdAt: { type: "date" },
        updatedAt: { type: "date" },
        name: searchProperty,
        email: searchProperty,
        image: { type: "keyword" },
      },
    },
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
  console.log("🖥️  Server running at http://localhost:" + `${port}`);
});
