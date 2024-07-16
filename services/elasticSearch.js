import { Client } from "@elastic/elasticsearch";
import { logger } from "../utils/logger.js";

export const client = new Client({
  node: "http://192.168.163.152:9200",
  requestTimeout: 5000,
});

const indexName = "lokendrausers";

// Create index
export async function createIndex() {
  try {
    const indexExists = await client.indices.exists({ index: indexName });
    if (indexExists.body) {
      return;
    }

    await client.indices.create({
      index: indexName,
      body: {
        settings: {
          analysis: {
            analyzer: {
              lowercase_analyzer: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase"],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: {
              type: "text",
              analyzer: "lowercase_analyzer",
              fields: {
                keyword: {
                  type: "keyword",
                  normalizer: "lowercase",
                },
              },
            },
            email: {
              type: "text",
              analyzer: "lowercase_analyzer",
              fields: {
                keyword: {
                  type: "keyword",
                  normalizer: "lowercase",
                },
              },
            },
            image: { type: "keyword" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
            active: { type: "boolean" },
          },
        },
      },
    });
  } catch (error) {
    logger.error("Error creating index:", error);
    throw error;
  }
}

// Search for users
export async function searchUser({ page, query, itemsPerPage }) {
  try {
    const elasticQuery = {
      bool: {
        must: [
          {
            bool: {
              should: [
                {
                  match: {
                    name: {
                      query: query,
                      operator: "and",
                      // fuzziness: "AUTO",
                    },
                  },
                },
                {
                  wildcard: {
                    "name.keyword": `*${query.toLowerCase()}*`,
                  },
                },
                {
                  match: {
                    email: {
                      query: query,
                      operator: "and",
                      // fuzziness: "AUTO",
                    },
                  },
                },
                {
                  wildcard: {
                    "email.keyword": `*${query.toLowerCase()}*`,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          {
            term: {
              active: true,
            },
          },
        ],
      },
    };

    const result = await client.search({
      index: indexName,
      body: {
        from: itemsPerPage * (page - 1),
        size: itemsPerPage,
        query: elasticQuery,
        sort: [{ createdAt: { order: "desc" } }],
      },
    });
    console.log(result);
    const users = result.body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
    return {
      ok: true,
      status: 200,
      data: {
        totalActiveUsers: result.body.hits.total.value,
        users: users,
      },
    };
  } catch (error) {
    logger.error("Error searching users in elastic :", error);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
}

// check if index not present or not connected
export async function initializeElasticsearch() {
  try {
    await createIndex();
    logger.info("✅ Elasticsearch initialized successfully");
  } catch (error) {
    logger.error("❌ Error initializing Elasticsearch:", error.message);
    throw error;
  }
}
