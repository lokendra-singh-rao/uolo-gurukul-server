const esClient = require("../elasticSearch");
const searchUsers = async (searchQuery, page, limit) => {
  const query = searchQuery
    ? {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    wildcard: {
                      "name.keyword": `*${searchQuery.toLowerCase()}*`,
                    },
                  },
                  {
                    wildcard: {
                      "email.keyword": `*${searchQuery.toLowerCase()}*`,
                    },
                  },
                ],
              },
            },
            {
              term: {
                deleted: false,
              },
            },
          ],
        },
      }
    : {
        bool: {
          must: [
            {
              term: {
                deleted: false,
              },
            },
          ],
        },
      };
  const response = await esClient.search({
    index: "kasak_userdata",
    from: (page - 1) * limit,
    size: limit,
    body: {
      query: query,
    },
  });
  return {
    users: response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    })),
    totalUsers: response.hits.total.value,
  };
};
module.exports = searchUsers;
