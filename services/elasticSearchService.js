import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node: "http://192.168.163.152:9200",
  requestTimeout: 2000,
});

const indexName = "lokendrausers";

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
    console.error("Error creating index:", error);
    throw error;
  }
}

// Add a new user
export async function ingestUser(user) {
  try {
    const response = await client.index({
      index: indexName,
      id: user.id,
      body: user,
    });

    return { ok: true, data: "Elastic insert successful" };
  } catch (error) {
    console.error("Error ingesting user:", error);
    return { ok: false, err: "Elastic insert failed" };
  }
}

// Search for users
export async function searchUser({ page, query, itemsPerPage }) {
  try {
    const elasticQuery =
      query && query.length > 0
        ? {
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
          }
        : {
            term: {
              active: true,
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

    const users = result.body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
    return {
      totalActiveUsers: result.body.hits.total.value,
      users: users,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}

// delete a user (set active to false)
export async function deleteUser(id) {
  try {
    const response = await client.update({
      index: indexName,
      id: id,
      body: {
        doc: {
          active: false,
          updatedAt: new Date().toISOString(),
        },
      },
    });
    return { ok: true, data: "Elastic soft delete successful" };
  } catch (error) {
    console.error("Error soft deleting user:", error);
    return {
      ok: false,
      err: "Elastic soft delete failed",
    };
  }
}

// check if index not present or not connected
export async function initializeElasticsearch() {
  try {
    await createIndex();
    console.log("✅ Elasticsearch initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Elasticsearch:", error);
    throw error;
  }
}
