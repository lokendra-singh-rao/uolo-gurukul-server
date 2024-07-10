import { client } from "../configurations/elasticClient.js";

export async function searchUser(query) {
  try {
    const result = await client.search({
      index: "lokendrausers",
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

export async function ingestUser(user) {
  try {
    const response = await client.index({
      index: "lokendrausers",
      type: "_doc",
      id: user.mongoId,
      body: {
        name: user.name,
        email: user.email,
        image: user.keyName,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      },
    });
    console.log(response);
    return { ok: true, err: "Elastic insert successful" };
  } catch (error) {
    console.log("err : ", error);
    return { ok: false, err: "Elastic insert failed" };
  }
}
