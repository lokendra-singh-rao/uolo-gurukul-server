import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: "http://192.168.163.152:9200",
});

export const createIndex = async (indexName) => {
  try {
    const response = await client.indices.create({ index: indexName });
  } catch (error) {
    console.log("Error creatig elastic index", error.message);
  }
};
