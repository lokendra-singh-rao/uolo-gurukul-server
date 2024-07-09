import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://192.168.163.152:9200",
});

async function createIndex() {
  try {
    await client.indices.create({
      index: "users",
      body: {
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
            email: {
              type: "keyword",
            },
            image: {
              type: "keyword",
              index: false,
            },
          },
        },
      },
    });
  } catch (error) {}
}

async function indexUser(user) {
  try {
    const result = await client.index({
      index: "users",
      id: user.email,
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {}
}

export async function searchUser(query) {
  try {
    const result = await client.search({
      index: "users",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["name", "email"],
          },
        },
      },
    });
    return result;
  } catch (error) {}
}

export async function ingestUser({ user }) {
  await createIndex();
  await indexUser({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  });
}
